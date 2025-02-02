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

        // Prüfe ob Interview-Fragen existieren
        const interview = await getInterviewByApplicantId(data._id);
        setHasInterviewQuestions(
          interview && 
          interview.questions && 
          interview.questions.length > 0
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

  // Add notification config at component level
  useEffect(() => {
    notification.config({
      placement: 'topRight',
      top: 100
    });
  }, []);

  const handleGenerateQuestions = async () => {
    setGeneratingQuestions(true);
    try {
      // Erst prüfen ob bereits ein Interview existiert
      let interview = await getInterviewByApplicantId(applicant._id);
      
      if (!interview) {
        // Wenn kein Interview existiert, erstelle ein neues
        interview = await createInterview(applicant._id);
      }
      
      if (!interview?._id) {
        throw new Error('No valid interview ID');
      }

      // Generiere Fragen mit der vorhandenen Interview ID
      await generateQuestions(interview._id);
      setHasInterviewQuestions(true);
      notification.success({
        message: "Interview Questions Generated",
        description: "The interview questions have been successfully generated and are ready for review.",
        icon: <CheckCircleOutlined style={{ color: "#547bae" }} />,
        duration: 4,
        pauseOnHover: true,
        style: { 
          backgroundColor: "rgba(255,255,255,0.8)",
          borderLeft: '4px solid #547bae',
          backdropFilter: 'blur(8px)'
        }
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
      onOk: handleGenerateQuestions
    });
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          padding: "24px",
          background: "var(--background)",
        }}
      >
        <Content>
          <Title
            level={1}
            style={{ color: "var(--text-color)", textAlign: "center" }}
          >
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
            <p style={{ color: "var(--text-color)", textAlign: "center" }}>
              Loading...
            </p>
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
                  background: "#1C1C1C",
                  borderRadius: "12px",
                  color: "var(--text-color)",
                  padding: "20px",
                }}
              >
                <Title level={3} style={{ color: "var(--text-color)" }}>
                  {applicant.prename} {applicant.surname}
                </Title>
                <Image
                  src={applicant.photo || "https://via.placeholder.com/150"}
                  alt="Applicant Photo"
                  width={120}
                  height={120}
                  style={{ borderRadius: "50%" }}
                />

                <Text style={{ color: "var(--text-color)" }}>
                  <strong>Age:</strong> 27
                </Text>
                <br />
                <Text style={{ color: "var(--text-color)" }}>
                  <strong>Education:</strong> B.Sc. Computer Science
                </Text>
                <br />
                <Text style={{ color: "var(--text-color)" }}>
                  <strong>Location:</strong> {applicant.address.city}
                </Text>
                <br />
                <Text style={{ color: "var(--text-color)" }}>
                  <strong>Status:</strong>{" "}
                  <Badge color="blue" text={applicant.status} />
                </Text>
                <br />

                <Title level={5} style={{ color: "var(--text-color)" }}>
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
                    background: "#1C1C1C",
                    color: "var(--text-color)",
                    padding: "20px",
                  }}
                >
                  <Button type="default" block>
                    CV
                  </Button>
                  <Button type="default" block>
                    Motivation Letter
                  </Button>
                  <Button type="default" block>
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
                    background: "#1C1C1C",
                    color: "var(--text-color)",
                    padding: "20px",
                    marginTop: "16px",
                  }}
                >
                  <Button type="primary" block>
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
                    background: "#1C1C1C",
                    color: "var(--text-color)",
                    padding: "20px",
                    marginTop: "16px",
                  }}
                >
                  <Button
                    type="primary"
                    block
                    onClick={confirmGenerateQuestions}
                    loading={generatingQuestions}
                  >
                    Generate New Interview Questions
                  </Button>
                  <Button 
                    type="default" 
                    block 
                    onClick={() => router.push(`/InterviewPrep?applicantId=${applicant._id}`)}
                    disabled={!hasInterviewQuestions}
                  >
                    Show Interview Questions
                  </Button>
                </Card>
              </div>
            </div>
          ) : (
            <p style={{ color: "var(--text-color)", textAlign: "center" }}>
              Applicant not found.
            </p>
          )}

          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Button
              type="default"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/ViewApplications")}
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
