import React, { useEffect, useState } from "react";
import "../app/globals.css";
import { Layout, Table, Input, message } from "antd";
import Link from "next/link";
import { SearchOutlined } from "@ant-design/icons";
import Sidebar from "../components/Global/Sidebar";
import { getApplicants } from "../services/applicantService";

const { Header, Content } = Layout;

const ApplicantsOverview = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const data = await getApplicants();
        setApplicants(data);
      } catch (error) {
        message.error("Error loading applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const filteredApplicants = applicants.filter((applicant) =>
    Object.values(applicant).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const getColumnFilters = (dataIndex) => {
    const uniqueValues = [
      ...new Set(applicants.map((item) => item[dataIndex])),
    ];
    return uniqueValues.map((value) => ({
      text: value,
      value: value,
    }));
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "prename",
      key: "prename",
      sorter: (a, b) => a.prename.localeCompare(b.prename),
      render: (_, record) => (
        <Link href={`/applicants/details/${record._id}`}>
          {record.surname}, {record.prename}
        </Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: getColumnFilters("status"),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      defaultSortOrder: "ascend",
      render: (text) => new Date(text).toLocaleDateString(),
    },
  ];

  return (
    <Layout
      style={{
        marginLeft: collapsed ? 80 : 200,
        transition: "margin-left 0.3s ease",
        backgroundColor: "#f0f2f5",
        minHeight: "100vh",
        height: "100%",
        display: "flex",
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ background: "#f0f2f5" }}>
        <Header
          style={{
            background: "#fff",
            color: "#333",
            padding: "0 24px",
            fontSize: "24px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ fontWeight: "600" }}>Applicants Overview</div>
        </Header>
        <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            size="large"
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ marginBottom: 16 }}
          />
          <Table
            className="custom-table"
            columns={columns}
            dataSource={filteredApplicants}
            rowKey="_id"
            loading={loading}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ApplicantsOverview;
