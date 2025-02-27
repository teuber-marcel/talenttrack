import "@ant-design/v5-patch-for-react-19";
import React, { useEffect, useState } from "react";
import "../../../app/globals.css";
import { Layout, Row, Col, Button, Input, message, Typography, notification } from "antd";
import {
  CloseCircleOutlined,
  PlayCircleOutlined,
  SaveOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,  
} from "@ant-design/icons";
import { useRouter } from "next/router";
import Sidebar from "../../../components/Global/Sidebar.jsx";
import EditRadioButtonGroup from "../../../components/EditVacancy/EditRadioButtonGroup.jsx";
import EditCheckboxGroup from "../../../components/EditVacancy/EditCheckboxGroup.jsx";
import EditVacancyTitleInput from "../../../components/EditVacancy/EditVacancyTitleInput.jsx";
import { getVacancyById } from "../../../services/vacancyService.js";

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

notification.config({
  placement: 'topRight',
  top: 100
});

const EditVacancy = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedHierarchy, setSelectedHierarchy] = useState(null);
  const [vacancyTitle, setVacancyTitle] = useState("");
  const [createdVacancy, setCreatedVacancy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [other, setOther] = useState("");

  const router = useRouter();
  const { id } = router.query;

  const handleUpdateVacancy = async () => {
    if (!createdVacancy || !createdVacancy._id) {
      message.error("No vacancy selected for update.");
      return;
    }

    
    if (
      vacancyTitle === createdVacancy.title &&
      selectedDepartment === createdVacancy.department &&
      selectedHierarchy === createdVacancy.hierarchy &&
      description === createdVacancy.description &&
      requirements === createdVacancy.requirements &&
      other === createdVacancy.other
    ) {
      message.info("No changes detected.");
      return;
    }

    const updatedFields = {
      title: vacancyTitle,
      department: selectedDepartment,
      hierarchy: selectedHierarchy,
      description,
      requirements,
      other,
    };

    console.log(
      "📤 Sending PATCH Request to API:",
      `/api/vacancies/${createdVacancy._id}/details`
    );
    console.log("📦 Data sent:", JSON.stringify(updatedFields, null, 2));

    try {
      const response = await fetch(`/api/vacancies/${createdVacancy._id}/details`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update vacancy");
      }

      showSuccessNotification();
      router.push("/VacanciesOverview");
    } catch (error) {
      console.error("❌ Error updating vacancy:", error);
      message.error(`Error updating vacancy: ${error.message}`);
    }
  };

  
  const showSuccessNotification = () => {
    notification.success({
      message: "Vacancy Updated",
      description: "The vacancy has been successfully updated.",
      icon: <CheckCircleOutlined style={{ color: "#547bae" }} />,
      duration: 4,
      pauseOnHover: true,
      style: {
        backgroundColor: "rgba(255,255,255,0.8)",
        borderLeft: '4px solid #547bae',
        backdropFilter: 'blur(8px)'
      }
    });
  };

  useEffect(() => {
    if (id) {
      const fetchVacancy = async () => {
        try {
          const data = await getVacancyById(id);
          if (!data || Object.keys(data).length === 0) {
            message.error("Fehler beim Laden der Vacancy");
            return;
          }

          setCreatedVacancy(data);
          setVacancyTitle(data.title || "");
          setSelectedDepartment(data.department || "");
          setSelectedHierarchy(data.hierarchy || "");
          setDescription(data.description || "");
          setRequirements(data.requirements || "");
          setOther(data.other || "");
        } catch (error) {
          message.error("Fehler beim Laden der Vacancy");
        }
      };
      fetchVacancy();
    }
  }, [id]);

  return (
    <Layout
      style={{
        marginLeft: collapsed ? 80 : 200,
        transition: "margin-left 0.3s ease",
        backgroundColor: "#f0f2f5", 
        minHeight: "100vh",
        display: "flex",
      }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ background: "#f0f2f5" }}>
        <Content style={{ padding: "24px" }}>
          {/* Title + Stepper */}
          <Row
            justify="space-between"
            align="middle"
            style={{ marginBottom: 24 }}
          >
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                Edit Vacancy
              </Title>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div
                style={{
                  padding: 16,
                  minHeight: 240,
                  background: "#fff", 
                  borderRadius: 8,
                  color: "#333", 
                  display: "flex",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <EditRadioButtonGroup
                  onChange={setSelectedDepartment}
                  value={selectedDepartment}
                />
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  padding: 16,
                  minHeight: 240,
                  background: "#fff", 
                  borderRadius: 8,
                  color: "#333", 
                  display: "flex",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <EditCheckboxGroup
                  onChange={setSelectedHierarchy}
                  value={selectedHierarchy}
                />
              </div>
            </Col>

            <Col span={24}>
              <div
                style={{
                  padding: 16,
                  minHeight: 120,
                  background: "#fff", 
                  borderRadius: 8,
                  color: "#333", 
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <EditVacancyTitleInput
                  onChange={setVacancyTitle}
                  value={vacancyTitle}
                />
              </div>
            </Col>

            <Col span={24}>
              <div
                style={{
                  background: "#fff", 
                  padding: "16px",
                  borderRadius: "8px",
                  marginTop: "16px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <Title level={4} style={{ marginTop: 0, marginBottom: 16, textAlign: "left"}}>
                  Description
                </Title>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  autoSize={{ minRows: 3 }}
                  style={{
                    background: "#fff", 
                    color: "#333", 
                    border: "1px solid #d9d9d9",
                    marginBottom: "12px",
                  }}
                />

                <Title level={4} style={{ marginTop: 0, marginBottom: 16, textAlign: "left" }}>
                  Requirements
                </Title>
                <TextArea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  autoSize={{ minRows: 3 }}
                  style={{
                    background: "#fff", 
                    color: "#333", 
                    border: "1px solid #d9d9d9",
                    marginBottom: "12px",
                  }}
                />

                <Title level={4} style={{ marginTop: 0, marginBottom: 16, textAlign: "left" }}>
                  Further Information
                </Title>
                <TextArea
                  value={other}
                  onChange={(e) => setOther(e.target.value)}
                  autoSize={{ minRows: 3 }}
                  style={{
                    background: "#fff", 
                    color: "#333", 
                    border: "1px solid #d9d9d9",
                  }}
                />
              </div>
            </Col>

            <Col
              span={24}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <Button
                type="default"
                icon={<CloseCircleOutlined />}
                size="large"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                size="large"
                disabled={
                  createdVacancy &&
                  vacancyTitle === createdVacancy.title &&
                  selectedDepartment === createdVacancy.department &&
                  selectedHierarchy === createdVacancy.hierarchy &&
                  description === createdVacancy.description &&
                  requirements === createdVacancy.requirements &&
                  other === createdVacancy.other
                }
                onClick={() => handleUpdateVacancy()}
              >
                Update Vacancy
              </Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EditVacancy;
