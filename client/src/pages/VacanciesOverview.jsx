import React, { useEffect, useState } from "react";
import "../app/globals.css";
import { Layout, Table, Button, Space, Input, Popconfirm, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Sidebar from "../components/Global/Sidebar";
import { getVacancies, deleteVacancy } from "../services/vacancyService";

const { Header, Content } = Layout;

const VacanciesOverview = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const data = await getVacancies();
        setVacancies(data);
      } catch (error) {
        message.error("Error loading vacancies");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  const handleDelete = async (id) => {
    try {
      const success = await deleteVacancy(id);

      if (success) {
        message.success("Vacancy deleted");
        setVacancies((prev) => prev.filter((vacancy) => vacancy._id !== id));
      } else {
        message.error("Error deleting vacancy");
      }
    } catch (error) {
      message.error("Error deleting vacancy");
    }
  };

  const filteredVacancies = vacancies.filter((vacancy) =>
    Object.values(vacancy).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      title: "Vacancy Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Link href={`/ViewApplications?id=${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Hierarchy Level",
      dataIndex: "hierarchy",
      key: "hierarchyLevel",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Applications",
      dataIndex: "applications",
      key: "applications",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Link href={`/vacancies/edit/${record._id}`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Confirm Deletion"
            onConfirm={() => setTimeout(() => handleDelete(record._id), 100)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
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
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Layout */}
      <Layout style={{ background: "var(--background)" }}>
        <Header
          style={{
            color: "white",
            background: "var(--background)",
            padding: 0,
            textAlign: "center",
            fontSize: "24px",
          }}
        >
          Vacancy Overview
        </Header>
        <Content style={{ margin: "16px", padding: 24 }}>
          <Space style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              size="large"
              onClick={() => router.push("/CreateVacancy")}
            >
              New Vacancy
            </Button>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              size="large"
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Space>
          <Table
            className="custom-table"
            columns={columns}
            dataSource={filteredVacancies}
            rowKey="_id"
            loading={loading}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default VacanciesOverview;
