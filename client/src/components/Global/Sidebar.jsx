// components/Sidebar.jsx
import React from "react";
import { Layout, Menu, Button, Tooltip } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const { Sider } = Layout;

const getItem = (label, key, icon) => ({
  key,
  icon,
  label: <Link href={key}>{label}</Link>,
});

const items = [
  getItem("Dashboard", "/Dashboard", <PieChartOutlined />),
  getItem("Vacancies", "/VacanciesOverview", <DesktopOutlined />),
  getItem("Applicants", "/Applicants", <UserOutlined />),
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const router = useRouter();
  const currentPath = router.pathname;

  /** Handle Logout */
  const handleLogout = () => {
    router.push("/"); // Redirect to the login page (home page)
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="sidebar"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #dee2e6",
      }}
    >
      {/* Logo Section */}
      <div
        className="sidebar-logo"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: "16px",
        }}
      >
        <img
          src="/assets/Logo_Klein.png"
          alt="TalentTrack Logo"
          style={{
            width: "30px",
            height: "30px",
            marginRight: collapsed ? "0px" : "10px",
          }}
        />
        {!collapsed && (
          <span
            style={{ fontSize: "18px", fontWeight: "bold", color: "#212529" }}
          >
            TalentTrack
          </span>
        )}
      </div>

      {/* Sidebar Menu */}
      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[currentPath]}
        items={items}
        className="sidebar-menu"
        style={{ backgroundColor: "#ffffff", color: "#212529" }}
      />

      {/* Logout Button */}
      <div
        style={{
          padding: "16px",
          textAlign: "center",
          borderTop: "1px solid #dee2e6",
        }}
      >
        {collapsed ? (
          <Tooltip title="Logout">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                fontSize: "20px",
                color: "#212529",
              }}
            />
          </Tooltip>
        ) : (
          <Button
            type="default"
            icon={<LogoutOutlined />}
            block
            onClick={handleLogout}
            style={{
              backgroundColor: "#f8f9fa",
              color: "#212529",
              border: "1px solid #dee2e6",
            }}
          >
            Logout
          </Button>
        )}
      </div>
    </Sider>
  );
};

export default Sidebar;
