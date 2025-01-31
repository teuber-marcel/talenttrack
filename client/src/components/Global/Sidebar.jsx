// components/Sidebar.jsx
import React, { useState } from "react";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Sider } = Layout;

const getItem = (label, key, icon, href) => ({
  key,
  icon,
  label: href ? <Link href={href}>{label}</Link> : label,
});

const items = [
  getItem("Dashboard", "1", <PieChartOutlined />, "/dashboard"),
  getItem("Vacancies", "2", <DesktopOutlined />, "/vacancies"),
  getItem("User", "sub1", <UserOutlined />, "/profile"),
  getItem("Team", "sub2", <TeamOutlined />, "/team"),
  getItem("Files", "9", <FileOutlined />, "/files"),
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} className="sidebar"
    style={{
        position: "fixed", // Keeps sidebar in place
        left: 0,
        top: 0,
        bottom: 0,
        height: "100vh", // Full height
        overflow: "hidden", // Prevents scrolling inside sidebar
        }}>
       <div className="sidebar-logo">Logo</div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          className="sidebar-menu"
        />
    </Sider>
  );
};

export default Sidebar;
