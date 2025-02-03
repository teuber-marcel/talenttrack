import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../../../app/globals.css";
import ProgressStepper from "../../../components/Global/ProgressStepper";
import {
  Layout,
  Card,
  Typography,
  Image,
  Progress,
  Button,
  Steps,
  message,
  Badge,
  Modal,
  notification,
  Row,
  Col,
  Space,
  Skeleton,
} from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Sidebar from "../../../components/Global/Sidebar";
import {
  getApplicantById,
  updateApplicantStatus,
} from "../../../services/applicantService";
import {
  createInterview,
  generateQuestions,
  getInterviewByApplicantId,
} from "../../../services/interviewService";
import "@ant-design/v5-patch-for-react-19";

const { Content } = Layout;
const { Title, Text } = Typography;

const cardStyle = {
  background: "#fff",
  border: "1px solid #d9d9d9",
  borderRadius: 8,
  padding: 24,
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  marginBottom: 24,
};

const steps = [
  { title: "Vacancy", status: "finish" },
  { title: "Applicant", status: "finish" },
  { title: "Interview", status: "wait" },
];

const ApplicantDetails = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasInterviewQuestions, setHasInterviewQuestions] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  const handleDownload = (filename) => {
    const filePath = `/assets/${filename}`;
    const link = document.createElement("a");
    link.href = filePath;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Global notification config
  useEffect(() => {
    notification.config({
      placement: "topRight",
      top: 100,
    });
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchApplicantData = async () => {
      try {
        const data = await getApplicantById(id);
        if (!data) throw new Error("Applicant not found");
        setApplicant(data);

        // Check if interview questions exist
        const interview = await getInterviewByApplicantId(data._id);
        setHasInterviewQuestions(
          interview && interview.questions && interview.questions.length > 0
        );
      } catch (error) {
        console.error("Error fetching applicant data:", error);
        message.error("Error loading applicant details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantData();
  }, [id]);

  /** Navigate to the "Schedule Interview" page with the applicant ID. */
  const handleScheduleInterview = () => {
    if (!applicant?._id) {
      message.error("No applicant ID found.");
      return;
    }
    // Replace route with your actual schedule interview path
    router.push(`/interviews/schedule/${applicant._id}`);
  };

  /** Send rejection: update applicant status to "Rejected" + success message. */
  const handleSendRejection = async () => {
    if (!applicant?._id) {
      message.error("No applicant ID found.");
      return;
    }
    try {
      await updateApplicantStatus(applicant._id, "Rejected");
      // Update local state
      setApplicant((prev) => ({ ...prev, status: "Rejected" }));
      // Show success notification
      notification.success({
        message: "Applicant Rejected",
        description:
          "The applicant has been successfully rejected, and an email has been sent.",
        icon: <CheckCircleOutlined style={{ color: "#1890ff" }} />,
        duration: 4,
        pauseOnHover: true,
        style: {
          backgroundColor: "#fff",
          borderLeft: "4px solid #1890ff",
        },
      });
    } catch (error) {
      console.error("Error rejecting applicant:", error);
      message.error("Failed to reject applicant.");
    }
  };

  /** Generate Interview Questions */
  const handleGenerateQuestions = async () => {
    setGeneratingQuestions(true);
    try {
      let interview = await getInterviewByApplicantId(applicant._id);
      if (!interview) {
        // If no interview exists, create a new one
        interview = await createInterview(applicant._id);
      }
      if (!interview?._id) {
        throw new Error("No valid interview ID");
      }
      // Generate questions
      await generateQuestions(interview._id);
      setHasInterviewQuestions(true);
      notification.success({
        message: "Interview Questions Generated",
        description:
          "The interview questions have been successfully generated and are ready for review.",
        icon: <CheckCircleOutlined style={{ color: "#1890ff" }} />,
        duration: 4,
        pauseOnHover: true,
        style: {
          backgroundColor: "#fff",
          borderLeft: "4px solid #1890ff",
        },
      });
      router.push(`/InterviewPrep?applicantId=${applicant._id}`);
    } catch (error) {
      console.error("Error generating questions:", error);
      message.error("Error generating interview questions");
    } finally {
      setGeneratingQuestions(false);
    }
  };

  /** Confirm overwrite of existing questions */
  const confirmGenerateQuestions = () => {
    Modal.confirm({
      title: "Generate New Interview Questions",
      content: "Are you sure you want to overwrite any existing questions?",
      okText: "Yes",
      cancelText: "No",
      onOk: handleGenerateQuestions,
    });
  };

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
                Applicant Details
              </Title>
            </Col>
            <Col style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 300, paddingBottom: 4 }}>
                <ProgressStepper steps={steps} currentStep={1} />
              </div>
            </Col>
          </Row>

          {loading ? (
            <Skeleton active />
          ) : !applicant ? (
            <Row justify="center" style={{ marginTop: 40 }}>
              <Text>Applicant not found.</Text>
            </Row>
          ) : (
            <Row gutter={[24, 24]}>
              {/* Left Panel - Profile Information */}
              <Col xs={24} md={8}>
                <Card style={cardStyle}>
                  <Title level={4} style={{ marginBottom: 16 }}>
                    {applicant.prename} {applicant.surname}
                  </Title>
                  <Image
                    src={applicant.photo || "https://via.placeholder.com/150"}
                    alt="Applicant Photo"
                    width={120}
                    height={120}
                    style={{ borderRadius: "50%", marginBottom: 16 }}
                  />

                  <Space direction="vertical" size={4}>
                    <Text>
                      <strong>Age:</strong> 27
                    </Text>
                    <Text>
                      <strong>Education:</strong> B.Sc. Computer Science
                    </Text>
                    <Text>
                      <strong>Location:</strong> {applicant.address?.city}
                    </Text>
                    <Text>
                      <strong>Status:</strong>{" "}
                      <Badge color="#1890ff" text={applicant.status} />
                    </Text>
                  </Space>

                  <Title level={5} style={{ marginTop: 16 }}>
                    Suitability
                  </Title>
                  <Progress
                    percent={applicant.suitabilityScore || 50}
                    strokeColor={
                      applicant.suitabilityScore >= 70
                        ? "#52c41a"
                        : applicant.suitabilityScore >= 50
                          ? "#faad14"
                          : "#ff4d4f"
                    }
                  />
                </Card>
              </Col>

              {/* Right Panel - Action Cards */}
              <Col xs={24} md={16}>
                <Card style={cardStyle} title="Downloads">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                      block
                      onClick={() => handleDownload("cv-template.pdf")}
                    >
                      CV
                    </Button>
                    <Button
                      block
                      onClick={() => handleDownload("motivation-letter.pdf")}
                    >
                      Motivation Letter
                    </Button>
                    <Button
                      block
                      onClick={() => handleDownload("degree-certification.pdf")}
                    >
                      Degree Certification
                    </Button>
                    <Button
                      block
                      onClick={() => handleDownload("work-resume.pdf")}
                    >
                      Work Resume
                    </Button>
                  </Space>
                </Card>

                <Card style={cardStyle} title="Further Steps">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      block
                      onClick={handleScheduleInterview}
                    >
                      Schedule Interview
                    </Button>
                    <Button danger block onClick={handleSendRejection}>
                      Send Rejection
                    </Button>
                  </Space>
                </Card>

                <Card style={cardStyle} title="Interview Preparation">
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      block
                      onClick={confirmGenerateQuestions}
                      loading={generatingQuestions}
                    >
                      Generate New Interview Questions
                    </Button>
                    <Button
                      block
                      onClick={() =>
                        router.push(
                          `/InterviewPrep?applicantId=${applicant._id}`
                        )
                      }
                      disabled={!hasInterviewQuestions}
                    >
                      Show Interview Questions
                    </Button>
                  </Space>
                </Card>
              </Col>
            </Row>
          )}

          {/* Footer Button */}
          <Row justify="end" style={{ marginTop: 24 }}>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.back()}>
              Cancel
            </Button>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ApplicantDetails;
