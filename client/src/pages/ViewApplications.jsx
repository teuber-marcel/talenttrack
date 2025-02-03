import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../app/globals.css";
import {
  Layout,
  Table,
  Badge,
  Card,
  Progress,
  Button,
  Typography,
  Skeleton,
  Tooltip,
  Row,
  Col,
  Dropdown,
  Menu,
  message,
  Input,
  Space,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  SearchOutlined,
  EditOutlined,
  LinkedinOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Sidebar from "../components/Global/Sidebar";
import { getVacancyWithApplicantsById } from "../services/vacancyService";
import ProgressStepper from "../components/Global/ProgressStepper";

const { Content } = Layout;
const { Title, Text } = Typography;

// A unified Card style for consistent appearance
const cardStyle = {
  borderRadius: 8,
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  border: "1px solid #d9d9d9",
  background: "#fff",
  padding: 24,
  marginBottom: 24,
};

const steps = [
  { title: "Vacancy", status: "finish" },
  { title: "Applicant", status: "wait" },
  { title: "Interview", status: "wait" },
];

// Example of possible statuses for a vacancy
const statusOptions = ["Draft", "Open", "Filled"];

const JobApplicationsPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [vacancy, setVacancy] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [linkedinSearchText, setLinkedinSearchText] = useState("");

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

  // PATCH request to update the vacancy status
  const handleStatusChange = async (newStatus) => {
    if (!vacancy || !vacancy._id) {
      message.error("No vacancy selected for update.");
      return;
    }
    if (newStatus === vacancy.status) {
      message.info(`Status is already '${newStatus}'.`);
      return;
    }
    try {
      const response = await fetch(`/api/vacancies/${vacancy._id}/details`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update vacancy status."
        );
      }
      // Success => update local vacancy state
      setVacancy((prev) => ({ ...prev, status: newStatus }));
      message.success(`Vacancy status updated to '${newStatus}'.`);
    } catch (err) {
      console.error("Error updating vacancy status:", err);
      message.error("Error updating vacancy status: " + err.message);
    }
  };

  // Create a Menu that calls handleStatusChange on item click
  const renderStatusMenu = (
    <Menu
      onClick={(info) => {
        handleStatusChange(info.key);
      }}
      selectedKeys={[vacancy?.status || ""]}
      items={statusOptions.map((option) => ({ key: option, label: option }))}
    />
  );

  // Helper: Return unique statuses among applicants
  const getApplicantStatusFilters = () => {
    const uniqueStatuses = [
      ...new Set(applicants.map((app) => app.status).filter(Boolean)),
    ];
    return uniqueStatuses.map((s) => ({ text: s, value: s }));
  };

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

  // Table columns with sorting & filtering
  const columns = [
    {
      title: "Name",
      dataIndex: "prename",
      key: "name",
      sorter: (a, b) => {
        const nameA = `${a.surname || ""}, ${a.prename || ""}`.toLowerCase();
        const nameB = `${b.surname || ""}, ${b.prename || ""}`.toLowerCase();
        return nameA.localeCompare(nameB);
      },
      render: (_, record) => `${record.surname}, ${record.prename}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: getApplicantStatusFilters(),
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) =>
        (a.status || "")
          .toLowerCase()
          .localeCompare((b.status || "").toLowerCase()),
      render: getStatusBadge,
    },
    {
      title: "Suitability",
      dataIndex: "suitabilityScore",
      key: "suitabilityScore",
      sorter: (a, b) => (a.suitabilityScore || 0) - (b.suitabilityScore || 0),
      render: (score) => (
        <Tooltip title={`${score}%`}>
          <Progress
            percent={score}
            showInfo={false}
            strokeColor={
              score >= 70 ? "#52c41a" : score >= 50 ? "#faad14" : "#ff4d4f"
            }
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
        >
          View Details
        </Button>
      ),
    },
  ];

  // Suitability cluster counts
  const total = applicants.length;
  const goodFit = applicants.filter((a) => a.suitabilityScore >= 70).length;
  const mediumFit = applicants.filter(
    (a) => a.suitabilityScore >= 50 && a.suitabilityScore < 70
  ).length;
  const badFit = applicants.filter((a) => a.suitabilityScore < 50).length;

  // Filter applicants by `searchText`
  const filteredApplicants = applicants.filter((app) =>
    Object.values(app).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  // Add new state for LinkedIn suggestions
  const [linkedinSuggestions] = useState([
    {
      id: 1,
      name: "Michael Chen",
      title: "Frontend Engineer at Google",
      suitabilityScore: 95,
      profileUrl: "https://linkedin.com/in/michaelchen",
    },
    {
      id: 2,
      name: "Sarah Mueller",
      title: "Senior Software Developer at Amazon",
      suitabilityScore: 92,
      profileUrl: "https://linkedin.com/in/smueller",
    },
    {
      id: 3,
      name: "David Kumar",
      title: "Full Stack Developer at Microsoft",
      suitabilityScore: 88,
      profileUrl: "https://linkedin.com/in/davidkumar",
    },
    {
      id: 4,
      name: "Emma Bergström",
      title: "Software Engineer at Spotify",
      suitabilityScore: 85,
      profileUrl: "https://linkedin.com/in/emmabergstrom",
    },
  ]);

  // Filter LinkedIn suggestions
  const filteredLinkedinSuggestions = linkedinSuggestions.filter((suggestion) =>
    Object.values(suggestion).some((value) =>
      value?.toString().toLowerCase().includes(linkedinSearchText.toLowerCase())
    )
  );

  const linkedinColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Current Title",
      dataIndex: "title",
      key: "title",
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
          />
        </Tooltip>
      ),
    },
    {
      title: "Profile",
      key: "profile",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<LinkedinOutlined />}
          href={record.profileUrl}
          target="_blank"
        >
          View Profile
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
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
                Vacancy Details
              </Title>
            </Col>
            <Col style={{ overflowX: "auto" }}>
              <div style={{ minWidth: 300, paddingBottom: 4 }}>
                <ProgressStepper steps={steps} currentStep={0} />
              </div>
            </Col>
          </Row>

          {/* Main Content */}
          {loading ? (
            <Skeleton active />
          ) : error ? (
            <div style={{ textAlign: "center", marginTop: 50 }}>
              <Space direction="vertical">
                <Text>Failed to load data.</Text>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={() => router.reload()}
                >
                  Retry
                </Button>
              </Space>
            </div>
          ) : (
            vacancy && (
              <Row gutter={[24, 24]}>
                {/* Left Column */}
                <Col xs={24} md={8}>
                  <Card
                    style={cardStyle}
                    title={
                      <Tooltip title={vacancy.title}>
                        <Title
                          level={4}
                          style={{
                            margin: 0,
                            fontSize: "clamp(16px, 2vw, 22px)", // Flexible Größe
                            whiteSpace: "normal", // Zeilenumbruch erlauben
                            wordBreak: "break-word", // Lange Wörter umbrechen
                            overflowWrap: "break-word", // Alternative für ältere Browser
                            textAlign: "center", // Optionale Zentrierung
                          }}
                        >
                          {vacancy.title}
                        </Title>
                      </Tooltip>
                    }
                  >
                    <Space direction="vertical" size="small">
                      <Text>
                        <strong>Department: </strong>
                        {vacancy.department}
                      </Text>
                      <Text>
                        <strong>Status: </strong>
                        <Dropdown
                          overlay={renderStatusMenu}
                          trigger={["click"]}
                          getPopupContainer={(trigger) => trigger.parentNode}
                        >
                          <div
                            style={{
                              display: "inline-block",
                              cursor: "pointer",
                              padding: "4px",
                              borderRadius: "4px",
                              border: "1px solid #0077B5",
                            }}
                          >
                            <Badge color="#1890ff" text={vacancy.status} />
                          </div>
                        </Dropdown>
                      </Text>
                    </Space>

                    <Title level={5} style={{ marginTop: 16 }}>
                      # Applications
                    </Title>
                    <Space direction="vertical" size={2}>
                      <Text>{total} Total</Text>
                      <Text>
                        <strong>Good Fit:</strong> {goodFit}
                      </Text>
                      <Text>
                        <strong>Medium Fit:</strong> {mediumFit}
                      </Text>
                      <Text>
                        <strong>Bad Fit:</strong> {badFit}
                      </Text>
                    </Space>

                    <Space style={{ marginTop: 16 }}>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() =>
                          router.push(`/vacancies/edit/${vacancy._id}`)
                        }
                      >
                        Edit Vacancy
                      </Button>
                      <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => router.push("/VacanciesOverview")}
                      >
                        Back
                      </Button>
                    </Space>
                  </Card>
                </Col>

                {/* Right Column */}
                <Col xs={24} md={16}>
                  {/* Existing Applicants Card */}
                  <Card style={cardStyle}>
                    {/* Header Row with Icon and Search */}
                    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                      <Col>
                        <Space>
                          <TeamOutlined style={{ fontSize: "24px" }} />
                          <span style={{ fontSize: "16px" }}>Current Applicants</span>
                        </Space>
                      </Col>
                      <Col xs={24} md={12} lg={8}>
                        <Input
                          placeholder="Search applicants..."
                          prefix={<SearchOutlined />}
                          allowClear
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </Col>
                    </Row>

                    <Table
                      columns={columns}
                      dataSource={filteredApplicants}
                      rowKey="_id"
                      pagination={{ pageSize: 5 }}
                    />
                  </Card>

                  {/* New LinkedIn Suggestions Card */}
                  <Card
                    style={cardStyle}
                    title={
                      <Space>
                        <LinkedinOutlined
                          style={{ color: "#0077B5", fontSize: "40px" }}
                        />
                        <span>Suggested Candidates on LinkedIn</span>
                      </Space>
                    }
                  >
                    <Alert
                      message="Demo Data Only"
                      description="Currently showing mock data. LinkedIn API integration required for real candidate suggestions."
                      type="warning"
                      showIcon
                      style={{ marginBottom: 16 }}
                      closable
                    />

                    {/* LinkedIn Search Field */}
                    <Row style={{ marginBottom: 16 }} justify="end">
                      <Col xs={24} md={12} lg={8}>
                        <Input
                          placeholder="Search LinkedIn suggestions..."
                          prefix={<SearchOutlined />}
                          allowClear
                          onChange={(e) =>
                            setLinkedinSearchText(e.target.value)
                          }
                        />
                      </Col>
                    </Row>

                    <Table
                      columns={linkedinColumns}
                      dataSource={filteredLinkedinSuggestions}
                      rowKey="id"
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
