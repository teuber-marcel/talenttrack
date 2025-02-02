import React, { useEffect, useState } from "react";
import { Layout, Typography, Row, Col, Card, Button, Image, message, notification, Input } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, DownloadOutlined, CloseCircleOutlined, RedoOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import Sidebar from "../components/Global/Sidebar";
import BackgroundBox from "../components/Global/BackgroundBox";
import { getApplicants } from "../services/applicantService";
import { getVacancyById } from "../services/vacancyService";
import ProgressStepper from "../components/Global/ProgressStepper";
import { createInterview, generateQuestions, getInterviewByApplicantId, downloadInterviewQuestions, saveInterviewQuestions } from "../services/interviewService";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

// 1. Globale Notification-Konfiguration: Legt die Grundeinstellungen für alle Notifications fest
notification.config({
  placement: 'topRight', // Position oben rechts
  top: 100 // Abstand von oben in Pixeln
});

const InterviewPreparation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [regenerating, setRegenerating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicantsData = await getApplicants();
        setApplicants(applicantsData);
        console.log('Applicants Data:', applicantsData); // Debug-Log

        if (applicantsData.length > 0) {
          if (applicantsData[0].vacancy) {
            const vacancyData = await getVacancyById(applicantsData[0].vacancy);
            setVacancy(vacancyData);
            console.log('Vacancy Data:', vacancyData); // Debug-Log
          }

          let interview = await getInterviewByApplicantId(applicantsData[0]._id);
          setCurrentInterview(interview); // Speichern des Interview-Objekts
          console.log('Initial Interview Data:', interview); // Debug-Log

          if (!interview) {
            interview = await createInterview(applicantsData[0]._id);
            console.log('Created Interview:', interview); // Debug-Log
            
            const questionsData = await generateQuestions(interview._id);
            console.log('Generated Questions Data:', questionsData); // Debug-Log
            
            // Anpassung hier: Wir prüfen die Struktur der questionsData
            const questions = questionsData.questions || questionsData;
            console.log('Final Questions to be set:', questions); // Debug-Log
            setInterviewQuestions(questions);
          } else {
            console.log('Existing Interview Questions:', interview.questions); // Debug-Log
            setInterviewQuestions(interview.questions || []);
          }
        }
      } catch (error) {
        console.error("Error:", error); // Debug-Log
        message.error("Fehler beim Laden der Daten");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debugging-Log für den State
  useEffect(() => {
    console.log('Current interviewQuestions state:', interviewQuestions);
  }, [interviewQuestions]);

  useEffect(() => {
    setEditedQuestions(interviewQuestions);
  }, [interviewQuestions]);

  const steps = [
    { title: "Job Overview", status: "finish" },
    { title: "Applicant Details", status: "finish" },
    { title: "Interview Preparation", status: "finish" }
  ];

  const handleDownload = async () => {
    if (!currentInterview) {
      message.error("No interview available for download");
      return;
    }
    
    try {
      const success = await downloadInterviewQuestions(currentInterview._id);
      if (success) {
        // 2. Notification-Aufruf: Zeigt eine Success-Notification mit benutzerdefinierten Styles
        notification.success({
          message: "Download Complete", // Titel der Notification
          description: "Interview questions have been successfully downloaded.", // Beschreibungstext
          icon: <CheckCircleOutlined style={{ color: "#547bae" }} />, // Custom Icon mit Farbe
          duration: 4, // Anzeigedauer in Sekunden
          pauseOnHover: true, // Pausiert Timer beim Hover
          style: { 
            backgroundColor: "rgba(255,255,255,0.8)", // Halbtransparenter Hintergrund
            borderLeft: '4px solid #547bae', // Farbiger Rand links
            backdropFilter: 'blur(8px)' // Glaseffekt
          }
        });
      } else {
        message.error("Failed to download interview questions");
      }
    } catch (error) {
      console.error('Download error:', error);
      message.error("Error during download");
    }
  };

  const handleRegenerate = async () => {
    if (!currentInterview) {
      message.error("No interview available");
      return;
    }
    setRegenerating(true);
    try {
      const response = await generateQuestions(currentInterview._id);
      setInterviewQuestions(response.questions || response);
      notification.success({
        message: "Questions Regenerated",
        description: "Interview questions have been successfully updated.",
        icon: <CheckCircleOutlined style={{ color: "#547bae" }} />,
        duration: 4,
        pauseOnHover: true,
        style: { 
          backgroundColor: "rgba(255,255,255,0.8)", 
          borderLeft: '4px solid #547bae', 
          backdropFilter: 'blur(8px)' 
        }
      });
    } catch (error) {
      message.error("Failed to regenerate questions");
    } finally {
      setRegenerating(false);
    }
  };

  const handleEditClick = () => {
    setEditMode(true);
    setEditedQuestions([...interviewQuestions]);
  };

  const handleQuestionChange = (index, newValue) => {
    const newQuestions = [...editedQuestions];
    newQuestions[index] = newValue;
    setEditedQuestions(newQuestions);
  };

  const handleDeleteQuestion = (indexToDelete) => {
    const newQuestions = editedQuestions.filter((_, index) => index !== indexToDelete);
    setEditedQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!currentInterview) return;
    
    try {
      await saveInterviewQuestions(currentInterview._id, editedQuestions);
      setInterviewQuestions(editedQuestions);
      setEditMode(false);
      notification.success({
        message: "Changes Saved",
        description: "Interview questions have been successfully updated.",
        icon: <CheckCircleOutlined style={{ color: "#547bae" }} />,
        duration: 4,
        style: { 
          backgroundColor: "rgba(255,255,255,0.8)", 
          borderLeft: '4px solid #547bae', 
          backdropFilter: 'blur(8px)' 
        }
      });
    } catch (error) {
      message.error("Failed to save changes");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#000000" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? 80 : 200, padding: "24px", background: "#000000" }}>
        <Content>
          <div style={{ 
            position: "absolute", 
            top: "24px", 
            left: "70%", 
            transform: "translateX(-50%)",
            zIndex: 1000
          }}>
            <ProgressStepper steps={steps} currentStep={0} />
          </div>

          <Title level={1}>Interview Preparation</Title>
          <Row justify="center" style={{ margin: "40px 0 16px" }}>
            {applicants.length > 0 && (
              <Col style={{ textAlign: "center" }}>
                <Card
                  style={{
                    background: '#333333',
                    borderRadius: '8px',
                    padding: '0px',  // Reduced from 20px to 12px
                    marginBottom: '20px',
                    width: '500px',
                    border: '1px solid #333333'  // Making border same color as background
                  }}
                >
                  <Row align="middle" justify="space-around">
                    <Col span={11}>  {/* Increased from 10 to 11 */}
                      <Title level={1} style={{ margin: 0, color: '#fff' }}>
                        {applicants[0].prename} {applicants[0].surname}
                      </Title>
                    </Col>
                    <Col span={11}>  {/* Increased from 10 to 11 */}
                      <Image
                        src={applicants[0].photo}
                        alt="Applicant photo"
                        width={160}
                        height={160}
                        style={{ borderRadius: "50%" }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            )}
          </Row>
          <Row justify="center">
            <Col span={20}>
              <BackgroundBox>
                <Title level={2} style={{ textAlign: "center", marginBottom: 8 }}>
                  {vacancy ? vacancy.title : "Loading..."}
                </Title>
                <Card bordered={true} style={{ minHeight: "200px", maxWidth: "100%", overflowY: "auto", color: '#000000' }}>
                  <div className="interview-questions">
                    {(editMode ? editedQuestions : interviewQuestions).map((question, index) => (
                      editMode ? (
                        <div key={index} className="question-item" style={{ 
                          marginBottom: '16px',
                          padding: '12px',
                          borderLeft: '4px solid #547bae',
                          backgroundColor: '#f5f5f5',
                          borderRadius: '4px',
                          color: '#000000',
                          display: 'flex',
                          gap: '8px'
                        }}>
                          <div style={{ flex: 1 }}>
                            <Input.TextArea
                              value={question}
                              onChange={(e) => handleQuestionChange(index, e.target.value)}
                              autoSize={{ minRows: 2 }}
                              style={{ fontSize: '16px', color: '#000000' }}
                            />
                          </div>
                          <Button
                            type="text"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => handleDeleteQuestion(index)}
                            style={{ alignSelf: 'flex-start' }}
                          />
                        </div>
                      ) : (
                        <div key={index} className="question-item" style={{ 
                          marginBottom: '16px',
                          padding: '12px',
                          borderLeft: '4px solid #547bae',
                          backgroundColor: '#f5f5f5',
                          borderRadius: '4px',
                          color: '#000000'
                        }}>
                          <Typography.Text strong style={{ fontSize: '16px', color: '#000000' }}>
                            {`${index + 1}. ${question}`}
                          </Typography.Text>
                        </div>
                      )
                    ))}
                  </div>
                </Card>
                <Row justify="space-between" style={{ marginTop: "16px" }}>
                  <div>
                    <Button 
                      onClick={handleRegenerate}
                      type="default"
                      size="large"
                      icon={<RedoOutlined />}
                      loading={regenerating}
                      style={{
                        height: "40px", 
                        padding: "0 24px",
                        backgroundColor: "#547bae",
                        borderColor: "#547bae",
                        color: "white",
                        marginRight: 8
                      }}
                    >
                      Regenerate
                    </Button>
                    {!editMode ? (
                      <Button 
                        onClick={handleEditClick} 
                        type="default" 
                        size="large"
                        icon={<EditOutlined />}
                        style={{ 
                          height: "40px", 
                          padding: "0 24px",
                          backgroundColor: "#547bae",
                          borderColor: "#547bae",
                          color: "white"
                        }}
                      >
                        Edit
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSave} 
                        type="default" 
                        size="large"
                        icon={<SaveOutlined />}
                        style={{ 
                          height: "40px", 
                          padding: "0 24px",
                          backgroundColor: "#547bae",
                          borderColor: "#547bae",
                          color: "white"
                        }}
                      >
                        Save
                      </Button>
                    )}
                  </div>
                  <div>
                    <Button 
                      onClick={() => {}} 
                      type="default" 
                      size="large"
                      icon={<CloseCircleOutlined />}
                      style={{ 
                        marginRight: 8, 
                        height: "40px", 
                        padding: "0 24px",
                        backgroundColor: "#547bae",
                        borderColor: "#547bae",
                        color: "white"
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleDownload} 
                      type="primary"
                      size="large"
                      icon={<DownloadOutlined />}
                      style={{ 
                        height: "40px", 
                        padding: "0 24px",
                        backgroundColor: "#547bae",
                        borderColor: "#547bae"
                      }}
                    >
                      Download
                    </Button>
                  </div>
                </Row>
              </BackgroundBox>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default InterviewPreparation;