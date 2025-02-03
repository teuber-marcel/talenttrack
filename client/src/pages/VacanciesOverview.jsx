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
import { getApplicantsForOverview } from "../services/applicantService"; // ✅ Imported new function

const { Header, Content } = Layout;

const VacanciesOverview = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();
  const { status } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vacancyData = await getVacancies();
        const applicantData = await getApplicantsForOverview();

        const applicantCount = applicantData.reduce((acc, applicant) => {
          acc[applicant.vacancy] = (acc[applicant.vacancy] || 0) + 1;
          return acc;
        }, {});

        const updatedVacancies = vacancyData.map((vacancy) => ({
          ...vacancy,
          applications: applicantCount[vacancy._id] || 0,
        }));

        // If there's a status in the URL, filter vacancies by that status
        if (status) {
          setVacancies(updatedVacancies.filter((v) => v.status === status));
        } else {
          setVacancies(updatedVacancies);
        }
      } catch (error) {
        message.error("Error loading vacancies or applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

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

  const getColumnFilters = (dataIndex) => {
    const uniqueValues = [...new Set(vacancies.map((item) => item[dataIndex]))];
    return uniqueValues.map((value) => ({
      text: value,
      value: value,
    }));
  };

  const columns = [
    {
      title: "Vacancy Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <Link href={`/ViewApplications?id=${record._id}`}>{text}</Link>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      filters: getColumnFilters("department"),
      onFilter: (value, record) => record.department === value,
    },
    {
      title: "Hierarchy Level",
      dataIndex: "hierarchy",
      key: "hierarchyLevel",
      filters: getColumnFilters("hierarchy"),
      onFilter: (value, record) => record.hierarchy === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: getColumnFilters("status"),
      onFilter: (value, record) => record.status === value,
      align: "center",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (text) => new Date(text).toLocaleDateString(),
      align: "center",
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      defaultSortOrder: "ascend",
      render: (text) => new Date(text).toLocaleDateString(),
      align: "center",
    },
    {
      title: "Applications",
      dataIndex: "applications",
      key: "applications",
      sorter: (a, b) => a.applications - b.applications,
      render: (count) => count,
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
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
        backgroundColor: "#f0f2f5", // replaced var(--background)
        minHeight: "100vh",
        height: "100%",
        display: "flex",
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ background: "#f0f2f5" }}>
        {" "}
        {/* replaced var(--background) */}
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
          <div style={{ fontWeight: "600" }}>Vacancies Overview</div>
        </Header>
        <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
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
