import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../../../app/globals.css";
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
} from "antd";
import { ArrowLeftOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Sidebar from "../../../components/Global/Sidebar";
import { getApplicantById } from "../../../services/applicantService";
import {
  createInterview,
  generateQuestions,
  getInterviewByApplicantId,
} from "../../../services/interviewService";

const { Content } = Layout;
const { Title, Text } = Typography;

const ApplicantDetails = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasInterviewQuestions, setHasInterviewQuestions] = useState(false);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchApplicantData = async () => {
      try {
        const data = await getApplicantById(id);
        if (!data) throw new Error("Applicant not found");
        setApplicant(data);

        // Check if interview questions already exist
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

  // Setup global notification config
  useEffect(() => {
    notification.config({
      placement: "topRight",
      top: 100,
    });
  }, []);

  const handleGenerateQuestions = async () => {
    setGeneratingQuestions(true);
    try {
      // First check if an interview exists
      let interview = await getInterviewByApplicantId(applicant._id);

      if (!interview) {
        // If no interview exists, create a new one
        interview = await createInterview(applicant._id);
      }

      if (!interview?._id) {
        throw new Error("No valid interview ID");
      }

      // Generate questions with the existing interview ID
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
          backgroundColor: "#ffffff",
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
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          padding: "24px",
          background: "#f0f2f5", // replaced var(--background)
        }}
      >
        <Content>
          <Title level={1} style={{ textAlign: "center", color: "#333" }}>
            {/* replaced var(--text-color) */}
            Applicant Details
          </Title>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "20px 0",
            }}
          >
            <Steps
              current={1}
              items={[
                { title: "Job Overview" },
                { title: "Applicant Details" },
                { title: "Interview Preparation" },
              ]}
            />
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#333" }}>Loading...</p>
          ) : applicant ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
                gap: "24px",
                alignItems: "flex-start",
              }}
            >
              {/* Left Panel - Profile Information */}
              <Card
                bordered={false}
                style={{
                  background: "#fff", // replaced #1C1C1C
                  border: "1px solid #d9d9d9",
                  borderRadius: "12px",
                  color: "#333", // replaced var(--text-color)
                  padding: "20px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <Title level={3} style={{ color: "#333" }}>
                  {/* replaced var(--text-color) */}
                  {applicant.prename} {applicant.surname}
                </Title>
                <Image
                  src={applicant.photo || "https://via.placeholder.com/150"}
                  alt="Applicant Photo"
                  width={120}
                  height={120}
                  style={{ borderRadius: "50%", marginBottom: 16 }}
                />

                <Text style={{ color: "#333" }}>
                  <strong>Age:</strong> 27
                </Text>
                <br />
                <Text style={{ color: "#333" }}>
                  <strong>Education:</strong> B.Sc. Computer Science
                </Text>
                <br />
                <Text style={{ color: "#333" }}>
                  <strong>Location:</strong> {applicant.address.city}
                </Text>
                <br />
                <Text style={{ color: "#333" }}>
                  <strong>Status:</strong>{" "}
                  <Badge color="#1890ff" text={applicant.status} />
                </Text>
                <br />

                <Title level={5} style={{ marginTop: 16, color: "#333" }}>
                  Suitability
                </Title>
                <Progress
                  percent={applicant.suitabilityScore || 50}
                  status="active"
                  strokeColor={
                    applicant.suitabilityScore >= 70
                      ? "#52c41a"
                      : applicant.suitabilityScore >= 50
                        ? "#faad14"
                        : "#ff4d4f"
                  }
                />
              </Card>

              {/* Right Panel - Actions */}
              <div>
                <Card
                  title="Downloads"
                  bordered={false}
                  style={{
                    background: "#fff",
                    border: "1px solid #d9d9d9",
                    borderRadius: "12px",
                    color: "#333",
                    padding: "20px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Button type="default" block style={{ marginBottom: 8 }}>
                    CV
                  </Button>
                  <Button type="default" block style={{ marginBottom: 8 }}>
                    Motivation Letter
                  </Button>
                  <Button type="default" block style={{ marginBottom: 8 }}>
                    Degree Certification
                  </Button>
                  <Button type="default" block>
                    Work Resume
                  </Button>
                </Card>

                <Card
                  title="Further Steps"
                  bordered={false}
                  style={{
                    background: "#fff",
                    border: "1px solid #d9d9d9",
                    borderRadius: "12px",
                    color: "#333",
                    padding: "20px",
                    marginTop: "16px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Button type="primary" block style={{ marginBottom: 8 }}>
                    Schedule Interview
                  </Button>
                  <Button type="default" block danger>
                    Send Rejection
                  </Button>
                </Card>

                <Card
                  title="Interview Preparation"
                  bordered={false}
                  style={{
                    background: "#fff",
                    border: "1px solid #d9d9d9",
                    borderRadius: "12px",
                    color: "#333",
                    padding: "20px",
                    marginTop: "16px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Button
                    type="primary"
                    block
                    onClick={confirmGenerateQuestions}
                    loading={generatingQuestions}
                    style={{ marginBottom: 8 }}
                  >
                    Generate New Interview Questions
                  </Button>
                  <Button
                    type="default"
                    block
                    onClick={() =>
                      router.push(`/InterviewPrep?applicantId=${applicant._id}`)
                    }
                    disabled={!hasInterviewQuestions}
                  >
                    Show Interview Questions
                  </Button>
                </Card>
              </div>
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#333" }}>
              Applicant not found.
            </p>
          )}

          <div style={{ marginTop: "24px", textAlign: "right" }}>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()} // <— Use router.back()
            >
              Cancel
            </Button>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ApplicantDetails;
