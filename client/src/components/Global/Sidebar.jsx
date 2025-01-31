// components/Sidebar.jsx
import React from "react";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";

const { Sider } = Layout;

/**
 * Helper to build Menu items.
 * 'key' should match the 'href' so that we can directly use the router.pathname
 * to highlight the correct menu item.
 */
const getItem = (label, key, icon) => ({
  key,      // <-- use the path as the key
  icon,
  label: <Link href={key}>{label}</Link>,
});

const items = [
  getItem("Dashboard", "/Dashboard", <PieChartOutlined />),
  getItem("Vacancies", "/VacanciesOverview", <DesktopOutlined />),
  getItem("Applicants", "/Applicants", <UserOutlined />),
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  // Grab the current route from Next.js router
  const router = useRouter();
  const currentPath = router.pathname; // e.g., "/dashboard", "/VacanciesOverview", etc.

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
        overflow: "hidden",
      }}
    >
      <div
        className="sidebar-logo"
        style={{ textAlign: "center", padding: "16px", color: "white" }}
      >
        {collapsed ? "🗂" : "Menu"}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        // Use 'selectedKeys' (controlled) instead of 'defaultSelectedKeys'
        selectedKeys={[currentPath]} 
        items={items}
        className="sidebar-menu"
      />
    </Sider>
  );
};

export default Sidebar;
