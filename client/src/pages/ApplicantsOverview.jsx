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
import { getApplicants, deleteApplicant } from "../services/applicantService";

const { Header, Content } = Layout;

const ApplicantsOverview = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const router = useRouter();

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

  const handleDelete = async (id) => {
    try {
      const success = await deleteApplicant(id);
      if (success) {
        message.success("Applicant deleted");
        setApplicants((prev) =>
          prev.filter((applicant) => applicant._id !== id)
        );
      } else {
        message.error("Error deleting applicant");
      }
    } catch (error) {
      message.error("Error deleting applicant");
    }
  };

  const filteredApplicants = applicants.filter((applicant) =>
    Object.values(applicant).some((value) =>
      value?.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "prename",
      key: "name",
      sorter: (a, b) => a.prename.localeCompare(b.prename),
      render: (_, record) => (
        <Link href={`/applicants/${record._id}`}>
          {record.surname}, {record.prename}
        </Link>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Link href={`/applicants/edit/${record._id}`}>
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
          <Space style={{ marginBottom: 16 }}>
            <Button
              type="primary"
              icon={<PlusCircleOutlined />}
              size="large"
              onClick={() => router.push("/CreateApplicant")}
            >
              New Applicant
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
