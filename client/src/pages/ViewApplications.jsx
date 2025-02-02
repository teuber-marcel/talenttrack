import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../app/globals.css";
import {
  Layout,
  Table,
  Badge,
  Steps,
  Card,
  Progress,
  Button,
  Typography,
  Skeleton,
  Tooltip,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import Sidebar from "../components/Global/Sidebar";
import { getVacancyWithApplicantsById } from "../services/vacancyService";
import ProgressStepper from "../components/Global/ProgressStepper";

const { Content } = Layout;
const { Title, Text } = Typography;

const steps = [
  { title: "Job Overview", status: "finish" },
  { title: "Applicant Details", status: "finish" },
  { title: "Interview Preparation", status: "finish" },
];

const JobApplicationsPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [vacancy, setVacancy] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const fetchVacancyData = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getVacancyWithApplicantsById(id);
        if (!data || !data.vacancy || !data.applicants) {
          throw new Error("Invalid API response");
        }
        setVacancy(data.vacancy);
        setApplicants(data.applicants || []);
      } catch (error) {
        console.error("Error fetching vacancy data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancyData();
  }, [id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      Applied: { color: "#1890ff", text: "Applied" },
      "Interview Scheduled": { color: "#faad14", text: "Interview" },
      Hired: { color: "#52c41a", text: "Hired" },
      Rejected: { color: "#ff4d4f", text: "Rejected" },
    };
    return (
      <Badge
        color={statusMap[status]?.color || "#666"}
        text={statusMap[status]?.text || status}
      />
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "prename",
      key: "name",
      render: (_, record) => `${record.surname}, ${record.prename}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: getStatusBadge,
    },
    {
      title: "Suitability",
      dataIndex: "suitabilityScore",
      key: "suitabilityScore",
      render: (score) => (
        <Tooltip title={`${score}%`}>
          <Progress
            percent={score}
            showInfo={false}
            strokeColor={
              score >= 70 ? "#52c41a" : score >= 50 ? "#faad14" : "#ff4d4f"
            }
            trailColor="#f0f0f0"
          />
        </Tooltip>
      ),
    },
    {
      title: "View Profile",
      key: "profile",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => router.push(`/applicants/details/${record._id}`)}
          style={{ padding: 0 }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Section */}
      <Layout style={{ marginLeft: collapsed ? 80 : 200, padding: "24px" }}>
        <Content style={{ background: "#f0f2f5", padding: "24px" }}>
          {/* Row for Title + Stepper */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 24 }}
          >
            <Col>
              <Title level={2} style={{ marginBottom: 0 }}>
                {vacancy ? `Applications for ${vacancy.title}` : "Loading..."}
              </Title>
            </Col>
            <Col>
              {/* The Progress Stepper, aligned to the right with black text for readability */}
              <ProgressStepper
                steps={steps}
                currentStep={0}
                style={{ color: "#333" }}
              />
            </Col>
          </Row>

          {loading ? (
            <Skeleton active />
          ) : error ? (
            <div style={{ textAlign: "center" }}>
              <p>Failed to load data.</p>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={() => router.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            vacancy && (
              <Row gutter={[24, 24]}>
                {/* Left Column */}
                <Col xs={24} md={8}>
                  <Card
                    bordered={false}
                    style={{
                      background: "#fff",
                      border: "1px solid #d9d9d9",
                      borderRadius: 8,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      padding: 24,
                    }}
                    title={
                      <Title level={4} style={{ margin: 0 }}>
                        {vacancy.title}
                      </Title>
                    }
                  >
                    <Text>
                      <strong>Department: </strong>
                      {vacancy.department}
                    </Text>
                    <br />
                    <Text>
                      <strong>Status: </strong>
                      <Badge color="#1890ff" text={vacancy.status} />
                    </Text>
                    <br />
                    <Title level={5} style={{ marginTop: 16 }}>
                      # Applications
                    </Title>
                    <Text>{applicants.length} Total</Text>
                    <br />
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => router.push("/VacanciesOverview")}
                      style={{ marginTop: 16 }}
                    >
                      Back to Vacancies
                    </Button>
                  </Card>
                </Col>

                {/* Right Column */}
                <Col xs={24} md={16}>
                  <Card
                    bordered={false}
                    style={{
                      background: "#fff",
                      border: "1px solid #d9d9d9",
                      borderRadius: 8,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                      padding: 24,
                    }}
                  >
                    <Table
                      columns={columns}
                      dataSource={applicants}
                      rowKey="_id"
                      pagination={{ pageSize: 5 }}
                    />
                  </Card>
                </Col>
              </Row>
            )
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default JobApplicationsPage;
