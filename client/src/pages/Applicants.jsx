import React, { useState } from "react";
import "../app/globals.css";
import { Layout, Menu } from "antd";
import theme from "antd/es/theme";
import Sidebar from "../components/Global/Sidebar";

const { Header, Content } = Layout;

const ApplicantsOverview = () => {
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
          <div style={{ fontWeight: "600" }}>Applicants Overview</div>
        </Header>
        <Content style={{ margin: "16px" }}>
          <div
            style={{
              color: "#212529",
              textAlign: "center",
              padding: "20px",
              background: "#ffffff",
              borderRadius: borderRadiusLG,
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            Page is still under construction! We appreciate your patience.
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default ApplicantsOverview;
