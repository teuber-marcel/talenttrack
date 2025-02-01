import React, { useState } from "react";
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
} from "antd";
import theme from "antd/es/theme";
import Sidebar from "../components/Global/Sidebar";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const columns = [
  { title: "ID", dataIndex: "id", key: "id" },
  { title: "Name", dataIndex: "name", key: "name" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => <Badge status="processing" text={status} />,
  },
  {
    title: "Suitability",
    dataIndex: "suitability",
    key: "suitability",
    render: () => <span>🟢🟡🔴</span>,
  },
  {
    title: "View Profile",
    dataIndex: "profile",
    key: "profile",
    render: () => <span>...</span>,
  },
];

const data = [
  {
    key: "1",
    id: "AP-246",
    name: "Daniel Jay Park",
    status: "New",
    suitability: "🟢",
  },
  {
    key: "2",
    id: "AP-245",
    name: "Sarah Johnson",
    status: "On Hold",
    suitability: "🟡",
  },
  {
    key: "3",
    id: "AP-244",
    name: "Michael Brown",
    status: "Rejected",
    suitability: "🔴",
  },
];

const JobApplicationsPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

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
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Layout */}
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
          View Job Applications
        </Header>
        <Content
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "24px",
            alignItems: "flex-start",
          }}
        >
          {/* Left Panel */}
          <Card
            title={
              <Title level={4} style={{ color: "white" }}>
                Software Developer Backend
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
              <strong>Department:</strong> IT
            </Text>
            <br />
            <Text style={{ color: "white" }}>
              <strong>Status:</strong> <Badge color="blue" text="Open" />
            </Text>
            <br />
            <Text style={{ color: "white" }}>
              <strong>Details:</strong> Published on 06.10.2024
            </Text>
            <Title level={5} style={{ color: "white" }}>
              Seniority Level
            </Title>
            <Radio.Group
              defaultValue="Junior"
              style={{
                marginBottom: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <Radio value="Junior" style={{ color: "white" }}>
                Junior Professional
              </Radio>
              <Radio value="Professional" style={{ color: "white" }}>
                Professional
              </Radio>
            </Radio.Group>
            <Title level={5} style={{ color: "white" }}>
              # Applications
            </Title>
            <Text style={{ color: "white" }}>3 Ideal Candidates</Text>
            <br />
            <Text style={{ color: "white" }}>2 Possible Candidates</Text>
            <br />
            <Text style={{ color: "white" }}>3 Unlikely Candidates</Text>
            <br />
            <Button
              type="default"
              block
              style={{
                marginTop: "16px",
                background: "#333",
                color: "white",
                border: "none",
              }}
            >
              Edit Description
            </Button>
            <Button
              type="primary"
              block
              style={{
                marginTop: "8px",
                background: "#0056b3",
                color: "white",
                border: "none",
              }}
            >
              Edit Status
            </Button>
          </Card>

          {/* Right Panel - Table and Progress Bar */}
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
              dataSource={data}
              style={{
                marginTop: "16px",
                background: "transparent",
                color: "white",
              }}
              pagination={{ pageSize: 5 }}
            />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "right",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            background: "var(--background)",
          }}
        >
          <Button
            type="default"
            style={{ background: "#333", color: "white", border: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            style={{ background: "#0056b3", color: "white", border: "none" }}
          >
            All Applications
          </Button>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default JobApplicationsPage;
