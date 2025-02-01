import React, { useEffect, useState } from "react";
import { Layout, Typography, Row, Col, Card, Button, Image, message } from "antd";
import Sidebar from "../components/Global/Sidebar";
import BackgroundBox from "../components/Global/BackgroundBox";
import { getApplicants } from "../services/applicantService";
import { getVacancyById } from "../services/vacancyService";
import ProgressStepper from "../components/Global/ProgressStepper";
import { createInterview, generateQuestions, getInterviewByApplicantId, downloadInterviewQuestions } from "../services/interviewService";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const InterviewPreparation = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);

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

  const exampleQuestions = [
    {
      question: "What is a closure in JavaScript?",
      answer:
        "A closure is a function that retains access to its lexical scope, even when the function is executed outside that scope."
    },
    {
      question: "Explain the concept of prototypal inheritance in JavaScript.",
      answer:
        "Prototypal inheritance is a feature in JavaScript used to add methods and properties to objects. It is a method by which an object can inherit the properties and methods of another object."
    }
  ];

  const steps = [
    { title: "Job Overview", status: "finish" },
    { title: "Applicant Details", status: "finish" },
    { title: "Interview Preparation", status: "process" }
  ];

  const handleDownload = async () => {
    if (!currentInterview) {
      message.error("No interview available for download");
      return;
    }
    
    const success = await downloadInterviewQuestions(currentInterview._id);
    if (success) {
      message.success("Interview questions downloaded successfully");
    } else {
      message.error("Failed to download interview questions");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#000000" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? 80 : 200, padding: "24px", background: "#000000" }}>
        <Content>
          <div style={{ position: "absolute", top: "24px", left: "70%", transform: "translateX(-50%)" }}>
            <ProgressStepper steps={steps} currentStep={0} />
          </div>
          <Title level={1}>Interview Preparation</Title>
          <Row justify="center" style={{ margin: "40px 0 16px" }}>
            {applicants.length > 0 && (
              <Col style={{ textAlign: "center" }}>
                <Title level={3}>{applicants[0].prename} {applicants[0].surname}</Title>
                <Image
                  src={applicants[0].photo}
                  alt="Applicant photo"
                  width={160}
                  height={160}
                  style={{ borderRadius: "50%" }}
                />
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
                    {interviewQuestions.map((question, index) => (
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
                    ))}
                  </div>
                </Card>
                <Row justify="end" style={{ marginTop: "16px" }}>
                  <Button 
                    onClick={() => {}} 
                    type="default" 
                    size="large"
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
                    style={{ 
                      height: "40px", 
                      padding: "0 24px",
                      backgroundColor: "#547bae",
                      borderColor: "#547bae"
                    }}
                  >
                    Download
                  </Button>
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