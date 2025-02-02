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
} from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import Sidebar from "../components/Global/Sidebar";
import { getVacancyWithApplicantsById } from "../services/vacancyService";

const { Content } = Layout;
const { Title, Text } = Typography;

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
    // Map statuses to colors you can read easily on a dark background
    const statusMap = {
      Applied: { color: "var(--highlight-color)", text: "Applied" },
      "Interview Scheduled": { color: "#faad14", text: "Interview" },
      Hired: { color: "#52c41a", text: "Hired" },
      Rejected: { color: "#ff4d4f", text: "Rejected" },
    };
    return (
      <Badge
        color={statusMap[status]?.color || "#888"}
        text={statusMap[status]?.text || status}
      />
    );
  };

  const columns = [
    {
      title: <span style={{ color: "var(--text-color)" }}>Name</span>,
      dataIndex: "prename",
      key: "name",
      render: (_, record) => (
        <span style={{ color: "var(--text-color)" }}>
          {record.surname}, {record.prename}
        </span>
      ),
    },
    {
      title: <span style={{ color: "var(--text-color)" }}>Status</span>,
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
    {
      title: <span style={{ color: "var(--text-color)" }}>Suitability</span>,
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
            // Add a dark track color for the progress bar
            trailColor="#3a3a3a"
          />
        </Tooltip>
      ),
    },
    {
      title: <span style={{ color: "var(--text-color)" }}>View Profile</span>,
      key: "profile",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => router.push(`/applicants/${record._id}`)}
          style={{ color: "var(--highlight-color)" }}
        >
          View Details
        </Button>
      ),
    },
  ];

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
            {vacancy ? `Applications for ${vacancy.title}` : "Loading..."}
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
              // Ant Steps default in light mode; override text color:
              style={{ color: "var(--text-color)" }}
            />
          </div>

          <Content
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "24px",
              alignItems: "flex-start",
            }}
          >
            {loading ? (
              <Skeleton active />
            ) : error ? (
              <div style={{ textAlign: "center", color: "var(--text-color)" }}>
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
                <>
                  <Card
                    title={
                      <Title level={4} style={{ color: "var(--text-color)" }}>
                        {vacancy.title}
                      </Title>
                    }
                    bordered={false}
                    style={{
                      background: "#1f1f1f",
                      color: "#f0f0f0",
                      border: "1px solid #2b2b2b",
                      borderRadius: 8,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                      padding: 24,
                    }}
                  >
                    <Text style={{ color: "var(--text-color)" }}>
                      <strong>Department:</strong> {vacancy.department}
                    </Text>
                    <br />
                    <Text style={{ color: "var(--text-color)" }}>
                      <strong>Status:</strong>{" "}
                      <Badge
                        color="var(--highlight-color)"
                        text={vacancy.status}
                      />
                    </Text>
                    <br />
                    <Title level={5} style={{ color: "var(--text-color)" }}>
                      # Applications
                    </Title>
                    <Text style={{ color: "var(--text-color)" }}>
                      {applicants.length} Total
                    </Text>
                    <br />
                    <Button
                      type="default"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => router.push("/VacanciesOverview")}
                      style={{
                        marginTop: "16px",
                        backgroundColor: "#ffffff", // white or a light color
                        color: "#000000", // black text
                        borderColor: "#d9d9d9", // optional subtle gray border }}
                      }}
                    >
                      Back to Vacancies
                    </Button>
                  </Card>

                  <div
                    style={{
                      background: "var(--card-background)",
                      padding: "24px",
                      borderRadius: "12px",
                      color: "var(--text-color)",
                      boxShadow: "0px 4px 6px rgba(0,0,0,0.5)",
                      border: `1px solid var(--border-color)`,
                    }}
                  >
                    <Table
                      columns={columns}
                      dataSource={applicants}
                      loading={loading}
                      pagination={{ pageSize: 5 }}
                      rowKey="_id"
                      rowClassName={() => "dark-table-row"}
                      style={{
                        background: "transparent", // Let the row CSS control the row backgrounds
                        marginTop: "16px",
                      }}
                    />
                  </div>
                </>
              )
            )}
          </Content>
        </Content>
      </Layout>
    </Layout>
  );
};

export default JobApplicationsPage;
