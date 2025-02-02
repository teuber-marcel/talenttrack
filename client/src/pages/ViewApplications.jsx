import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../app/globals.css";
import {
  Layout,
  Table,
  Badge,
  Steps,
  Card,
  Radio,
  Button,
  Typography,
  message,
} from "antd";
import Sidebar from "../components/Global/Sidebar";
import { getVacancyWithApplicantsById } from "../services/vacancyService";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const JobApplicationsPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [vacancy, setVacancy] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log("Router Query ID:", id);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const fetchVacancyData = async () => {
      setLoading(true);
      try {
        console.log(`Fetching vacancy with applicants for ID: ${id}`);

        const data = await getVacancyWithApplicantsById(id);
        console.log("API Response Data:", data);

        if (!data || !data.vacancy || !data.applicants) {
          throw new Error("Invalid API response");
        }

        setVacancy(data.vacancy);
        setApplicants(data.applicants || []);
      } catch (error) {
        console.error("Error fetching vacancy data:", error);
        message.error("Error loading job applications");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancyData();
  }, [id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      Applied: "blue",
      "Interview Scheduled": "orange",
      Hired: "green",
      Rejected: "red",
    };
    return <Badge color={statusMap[status] || "gray"} text={status} />;
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Name", dataIndex: "prename", key: "prename" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusBadge(status),
    },
    {
      title: "Suitability",
      dataIndex: "suitabilityScore",
      key: "suitabilityScore",
      render: (score) => (score !== null ? `${score}%` : "N/A"),
    },
    {
      title: "View Profile",
      key: "profile",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => router.push(`/applicants/${record._id}`)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Layout
      style={{
        marginLeft: collapsed ? 80 : 200,
        transition: "margin-left 0.3s ease",
        backgroundColor: "var(--background)",
        minHeight: "100vh",
        height: "100%",
        display: "flex",
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout style={{ background: "var(--background)", padding: "24px" }}>
        <Header
          style={{
            color: "white",
            background: "var(--background)",
            padding: "16px 0",
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "bold",
          }}
        >
          {vacancy ? `View Applications for ${vacancy.title}` : "Loading..."}
        </Header>
        <Content
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "24px",
            alignItems: "flex-start",
          }}
        >
          {vacancy && (
            <Card
              title={
                <Title level={4} style={{ color: "white" }}>
                  {vacancy.title}
                </Title>
              }
              bordered={false}
              style={{
                background: "#202020",
                borderRadius: "12px",
                padding: "16px",
                color: "white",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
              }}
            >
              <Text style={{ color: "white" }}>
                <strong>Department:</strong> {vacancy.department}
              </Text>
              <br />
              <Text style={{ color: "white" }}>
                <strong>Status:</strong>{" "}
                <Badge color="blue" text={vacancy.status} />
              </Text>
              <br />
              <Title level={5} style={{ color: "white" }}>
                # Applications
              </Title>
              <Text style={{ color: "white" }}>{applicants.length} Total</Text>
            </Card>
          )}
          <div
            style={{
              background: "#202020",
              padding: "24px",
              borderRadius: "12px",
              color: "white",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
            }}
          >
            <Steps
              current={0}
              items={[
                { title: "Job Overview" },
                { title: "Applicant Details" },
                { title: "Interview Preparation" },
              ]}
            />
            <Table
              columns={columns}
              dataSource={applicants}
              loading={loading}
              style={{
                marginTop: "16px",
                background: "transparent",
                color: "white",
              }}
              pagination={{ pageSize: 5 }}
              rowKey="_id"
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default JobApplicationsPage;
