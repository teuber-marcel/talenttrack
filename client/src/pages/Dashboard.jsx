import React, { useState } from "react";
import "../app/globals.css";
import { Layout, Menu, Row, Col } from "antd";
import theme from "antd/es/theme";
import DonutChart from "../components/Dashboard/DonutChart";
import ApplicantDashboard from "../components/Dashboard/ApplicantDashboard";
import CalendarComponent from "../components/Dashboard/Calendar"; // Import CalendarComponent
import Sidebar from "../components/Global/Sidebar";

const { Header, Content } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Extract color and border-radius tokens from Ant Design theme
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{
        marginLeft: collapsed ? 80 : 200,
        transition: "margin-left 0.3s ease",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        height: "100%",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Layout */}
      <Layout style={{ background: "#f8f9fa" }}>
        <Header
          style={{
            background: "#fff",
            color: "#333",
            padding: "0 24px",
            fontSize: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div style={{ fontWeight: "600" }}>"Your Company's" Dashboard</div>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div>
            {/* Dashboard Layout */}
            <Row gutter={[16, 16]}>
              {/* DonutChart */}
              <Col span={12}>
                <div
                  style={{
                    padding: 16,
                    minHeight: 420,
                    maxHeight: 420,
                    background: "#ffffff",
                    borderRadius: borderRadiusLG,
                    textAlign: "center",
                    color: "#212529",
                    display: "flex",
                    justifyContent: "center",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ width: "95%", height: "95%" }}>
                    <DonutChart />
                  </div>
                </div>
              </Col>

              {/* ApplicantDashboard */}
              <Col span={12}>
                <div
                  style={{
                    padding: 16,
                    minHeight: 420,
                    maxHeight: 420,
                    background: "#ffffff",
                    borderRadius: borderRadiusLG,
                    textAlign: "center",
                    color: "#212529",
                    overflowY: "auto",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ width: "95%", height: "95%" }}>
                    <ApplicantDashboard />
                  </div>
                </div>
              </Col>

              {/* Full-Width Calendar */}
              <Col span={24}>
                <div
                  style={{
                    padding: 16,
                    minHeight: 400,
                    background: "#ffffff",
                    borderRadius: borderRadiusLG,
                    textAlign: "center",
                    color: "#212529",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <div style={{ width: "100%", height: "100%" }}>
                    <CalendarComponent />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
