import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Image,
  message,
  notification,
  Input,
  Space,
  Skeleton,
  Modal,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  RedoOutlined,
  EditOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Sidebar from "../components/Global/Sidebar";
import { getApplicantById } from "../services/applicantService";
import { getVacancyById } from "../services/vacancyService";
import ProgressStepper from "../components/Global/ProgressStepper";
import {
  createInterview,
  generateQuestions,
  getInterviewByApplicantId,
  downloadInterviewQuestions,
  saveInterviewQuestions,
} from "../services/interviewService";
import { useRouter } from "next/router";
import "@ant-design/v5-patch-for-react-19";

const { Content } = Layout;
const { Title, Text } = Typography;

// Unify card style for consistent appearance
const cardStyle = {
  background: "#fff",
  border: "1px solid #d9d9d9",
  borderRadius: 8,
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  padding: 24,
  marginBottom: 24,
};

const steps = [
  { title: "Vacancy", status: "finish" },
  { title: "Applicant", status: "finish" },
  { title: "Interview", status: "finish" },
];

// Configure notifications globally
notification.config({
  placement: "topRight",
  top: 100,
});

const InterviewPreparation = () => {
  const router = useRouter();
  const { applicantId } = router.query;

  const [collapsed, setCollapsed] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);

  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [regenerating, setRegenerating] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editedQuestions, setEditedQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!applicantId) return;

      try {
        // 1) Fetch the applicant
        const applicantData = await getApplicantById(applicantId);
        if (!applicantData) throw new Error("Applicant not found");
        setApplicant(applicantData);

        // 2) Fetch the vacancy
        if (applicantData.vacancy) {
          const vacancyData = await getVacancyById(applicantData.vacancy);
          setVacancy(vacancyData);
        }

        // 3) Check for an existing interview
        let interview = await getInterviewByApplicantId(applicantId);
        setCurrentInterview(interview);

        // 4) If no interview, create and generate new Qs; else load existing Qs
        if (!interview) {
          interview = await createInterview(applicantId);
          const questionsData = await generateQuestions(interview._id);
          const questions = questionsData.questions || questionsData;
          setInterviewQuestions(questions);
        } else {
          setInterviewQuestions(interview.questions || []);
        }
      } catch (error) {
        console.error("Error:", error);
        message.error("Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [applicantId]);

  // Keep a separate "draft" array for editing
  useEffect(() => {
    setEditedQuestions(interviewQuestions);
  }, [interviewQuestions]);

  // Debugging
  useEffect(() => {
    console.log("Current interviewQuestions state:", interviewQuestions);
  }, [interviewQuestions]);

  /** Download the interview questions */
  const handleDownload = async () => {
    if (!currentInterview) {
      message.error("No interview available for download");
      return;
    }

    try {
      const success = await downloadInterviewQuestions(currentInterview._id);
      if (success) {
        notification.success({
          message: "Download Complete",
          description: "Interview questions have been successfully downloaded.",
          icon: <CheckCircleOutlined style={{ color: "#1890ff" }} />,
          duration: 4,
          pauseOnHover: true,
          style: {
            backgroundColor: "#fff",
            borderLeft: "4px solid #1890ff",
          },
        });
      } else {
        message.error("Failed to download interview questions");
      }
    } catch (error) {
      console.error("Download error:", error);
      message.error("Error during download");
    }
  };

  /** Regenerate Qs */
  const handleRegenerate = async () => {
    if (!currentInterview) {
      message.error("No interview available");
      return;
    }
    setRegenerating(true);
    try {
      const response = await generateQuestions(currentInterview._id);
      const newQs = response.questions || response;
      setInterviewQuestions(newQs);
      notification.success({
        message: "Questions Regenerated",
        description: "Interview questions have been successfully updated.",
        icon: <CheckCircleOutlined style={{ color: "#1890ff" }} />,
        duration: 4,
        pauseOnHover: true,
        style: {
          backgroundColor: "#fff",
          borderLeft: "4px solid #1890ff",
        },
      });
    } catch (error) {
      message.error("Failed to regenerate questions");
    } finally {
      setRegenerating(false);
    }
  };

  /** Enter or exit Edit Mode */
  const handleEditClick = () => {
    setEditMode(true);
    setEditedQuestions([...interviewQuestions]);
  };

  /** Handle typed changes in a question text area */
  const handleQuestionChange = (index, newValue) => {
    const newQuestions = [...editedQuestions];
    newQuestions[index] = newValue;
    setEditedQuestions(newQuestions);
  };

  /** Remove a question from the list while editing */
  const handleDeleteQuestion = (indexToDelete) => {
    const newQuestions = editedQuestions.filter((_, i) => i !== indexToDelete);
    setEditedQuestions(newQuestions);
  };

  /** Save changes to the interview questions */
  const handleSave = async () => {
    if (!currentInterview) return;

    try {
      await saveInterviewQuestions(currentInterview._id, editedQuestions);
      setInterviewQuestions(editedQuestions);
      setEditMode(false);
      notification.success({
        message: "Changes Saved",
        description: "Interview questions have been successfully updated.",
        icon: <CheckCircleOutlined style={{ color: "#1890ff" }} />,
        duration: 4,
        style: {
          backgroundColor: "#fff",
          borderLeft: "4px solid #1890ff",
        },
      });
    } catch (error) {
      message.error("Failed to save changes");
    }
  };

  /** Confirm regeneration, overwriting existing Qs */
  const confirmGenerateQuestions = () => {
    if (!currentInterview) {
      message.error("No interview available");
      return;
    }
    Modal.confirm({
      title: "Generate New Interview Questions",
      content: "Are you sure you want to overwrite any existing questions?",
      okText: "Yes",
      cancelText: "No",
      onOk: handleRegenerate,
    });
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout style={{ marginLeft: collapsed ? 80 : 200, padding: 24 }}>
          <Content style={{ background: "#f0f2f5", padding: 24 }}>
            <Skeleton active />
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Content style={{ padding: "24px" }}>
          {/* Title + Stepper */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 24 }}
          >
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Interview Preparation
              </Title>
            </Col>
            <Col style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 300, paddingBottom: 4 }}>
                <ProgressStepper steps={steps} currentStep={0} />
              </div>
            </Col>
          </Row>

          {/* If applicant not found */}
          {!applicant ? (
            <Row justify="center" style={{ marginTop: 40 }}>
              <Text>Applicant not found.</Text>
            </Row>
          ) : (
            <>
              {/* Applicant Header Card */}
              <Row justify="center" style={{ marginBottom: 10 }}>
                <Col xs={24} md={20}>
                  <Card style={cardStyle}>
                    <Row justify="center">
                      <Col xs={24} md={14}>
                        <Row gutter={[16, 16]} align="middle">
                          <Col xs={24} md={12}>
                            <Title level={1} style={{ margin: 0 }}>
                              {applicant.prename} {applicant.surname}
                            </Title>
                            <Text type="secondary">
                              {vacancy?.title
                                ? `Vacancy: ${vacancy.title}`
                                : ""}
                            </Text>
                          </Col>
                          <Col xs={24} md={12} style={{ textAlign: "center" }}>
                            <Image
                              src={
                                applicant.photo ||
                                "https://via.placeholder.com/150"
                              }
                              alt="Applicant Photo"
                              width={150}
                              height={150}
                              style={{ borderRadius: "50%" }}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              {/* Interview Questions Container */}
              <Row justify="center">
                <Col xs={24} md={20}>
                  <Card style={cardStyle}>
                    <Title
                      level={4}
                      style={{ marginBottom: 16, textAlign: "center" }}
                    >
                      {vacancy ? vacancy.title : "Loading..."}
                    </Title>

                    {/* Interview Questions List */}
                    <Card
                      style={{
                        marginBottom: 16,
                        maxHeight: 400,
                        overflowY: "auto",
                        background: "#fafafa",
                      }}
                    >
                      {(editMode ? editedQuestions : interviewQuestions).map(
                        (question, index) =>
                          editMode ? (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                gap: 8,
                                marginBottom: 12,
                                padding: "8px",
                                borderLeft: "4px solid #1890ff",
                                borderRadius: 4,
                                background: "#fff",
                              }}
                            >
                              <Input.TextArea
                                value={question}
                                onChange={(e) =>
                                  handleQuestionChange(index, e.target.value)
                                }
                                autoSize={{ minRows: 2 }}
                                style={{ flex: 1 }}
                              />
                              <Button
                                type="text"
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => handleDeleteQuestion(index)}
                              />
                            </div>
                          ) : (
                            <div
                              key={index}
                              style={{
                                marginBottom: 12,
                                padding: 8,
                                borderLeft: "4px solid #1890ff",
                                borderRadius: 4,
                                background: "#fff",
                              }}
                            >
                              <Text strong>{`${index + 1}. ${question}`}</Text>
                            </div>
                          )
                      )}
                    </Card>

                    {/* Bottom Buttons */}
                    <Row justify="space-between">
                      <Space>
                        <Button
                          onClick={confirmGenerateQuestions}
                          size="large"
                          icon={<RedoOutlined />}
                          loading={regenerating}
                          type="primary"
                        >
                          Regenerate
                        </Button>
                        {!editMode ? (
                          <Button
                            onClick={handleEditClick}
                            size="large"
                            icon={<EditOutlined />}
                            type="primary"
                          >
                            Edit
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSave}
                            size="large"
                            icon={<SaveOutlined />}
                            type="primary"
                          >
                            Save
                          </Button>
                        )}
                      </Space>

                      <Space>
                        <Button
                          onClick={() => router.back()}
                          size="large"
                          icon={<ArrowLeftOutlined />}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleDownload}
                          type="primary"
                          size="large"
                          icon={<DownloadOutlined />}
                        >
                          Download
                        </Button>
                      </Space>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default InterviewPreparation;
