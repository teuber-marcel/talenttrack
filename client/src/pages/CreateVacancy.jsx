import React, { useState } from 'react';
import '../app/globals.css';
import { Layout, Row, Col, Button, Input, message, Typography } from 'antd';
import { CloseCircleOutlined, PlayCircleOutlined, SaveOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Sidebar from '../components/Global/Sidebar.jsx';
import RadioButtonGroup from '../components/CreateVacancy/RadioButtonGroup.jsx';
import CheckboxGroup from '../components/CreateVacancy/CheckboxGroup.jsx';
import VacancyTitleInput from '../components/CreateVacancy/VacancyTitleInput.jsx';
import { deleteVacancy } from '../services/vacancyService.js';

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

const CreateVacancy = () => {
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

  const isCreateDisabled = 
    !selectedDepartment || 
    !selectedHierarchy || 
    vacancyTitle.length < 3;

  // Vacancy erstellen (POST /api/vacancies)
  const handleCreateVacancy = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: vacancyTitle,
          department: selectedDepartment,
          hierarchy: selectedHierarchy,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create vacancy');
      }

      const data = await response.json();
      setCreatedVacancy(data);
      setDescription(data.description);
      setRequirements(data.requirements);
      setOther(data.other);
      message.success('Vacancy successfully created!');
    } catch (error) {
      console.error("Error creating vacancy:", error);
      message.error("Error creating vacancy");
    }
    setLoading(false);
  };

  // Vacancy aktualisieren (PATCH /api/vacancies/:id/details)
  const handleUpdateVacancy = async (status) => {
    if (!createdVacancy) return;

    const updatedFields = { description, requirements, other };
    if (status) {
        updatedFields.status = status;
    }

    console.log("📤 Sending PATCH Request to API:", `/api/vacancies/${createdVacancy._id}/details`);
    console.log("📦 Data sent:", JSON.stringify(updatedFields, null, 2));

    try {
        const response = await fetch(`/api/vacancies/${createdVacancy._id}/details`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedFields),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update vacancy');
        }

        message.success(`Vacancy ${status ? "Published" : "Draft"} successfully!`);
        router.push('/VacanciesOverview');
    } catch (error) {
        console.error("❌ Error updating vacancy:", error);
        message.error(`Error updating vacancy: ${error.message}`);
    }
};

const handleDeleteVacancy = async () => {
  if (!createdVacancy) {
    router.push('/VacanciesOverview');
    return;
  }

  try {
    const success = await deleteVacancy(createdVacancy._id);
    if (success) {
      message.success("Vacancy successfully deleted!");
      router.push('/VacanciesOverview'); // Erst nach erfolgreicher Löschung weiterleiten
    } else {
      message.error("Error deleting vacancy");
    }
  } catch (error) {
    console.error("Error deleting vacancy:", error);
    message.error("Error deleting vacancy");
  }
};


  return (
    <Layout
      style={{
        marginLeft: collapsed ? 80 : 200,
        transition: "margin-left 0.3s ease",
        backgroundColor: "#f0f2f5", // replaced var(--background)
        minHeight: '100vh',
        display: 'flex'
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
                Create Vacancy
              </Title>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div
                style={{
                  padding: 16,
                  minHeight: 240,
                  background: "#fff", // changed from #333
                  borderRadius: 8,
                  color: "#333", // changed from 'white'
                  display: 'flex',
                  justifyContent: 'center',
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <RadioButtonGroup
                  onChange={setSelectedDepartment}
                  disabled={!!createdVacancy}
                />
              </div>
            </Col>
            <Col span={12}>
              <div
                style={{
                  padding: 16,
                  minHeight: 240,
                  background: "#fff", // changed from #333
                  borderRadius: 8,
                  color: "#333", // changed from 'white'
                  display: 'flex',
                  justifyContent: 'center',
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <CheckboxGroup
                  onChange={setSelectedHierarchy}
                  disabled={!!createdVacancy}
                />
              </div>
            </Col>

            <Col span={24}>
              <div
                style={{
                  padding: 16,
                  minHeight: 120,
                  background: "#fff", // changed from #333
                  borderRadius: 8,
                  color: "#333", // changed from 'white'
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <VacancyTitleInput
                  onChange={setVacancyTitle}
                  disabled={!!createdVacancy}
                />
              </div>
            </Col>

            {/* Beschreibung, Anforderungen, Sonstiges - Felder */}
            {createdVacancy && (
              <Col span={24}>
                <div
                  style={{
                    background: "#fff", // changed from #333
                    padding: '16px',
                    borderRadius: '8px',
                    marginTop: '16px',
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
                      background: "#fff", // changed from #222
                      color: "#333", // changed from 'white'
                      border: "1px solid #d9d9d9",
                      marginBottom: '12px',
                    }} 
                  />

                  <Title level={4} style={{ marginTop: 0, marginBottom: 16, textAlign: "left"}}>
                    Requirements
                  </Title>
                  <TextArea 
                    value={requirements} 
                    onChange={(e) => setRequirements(e.target.value)}
                    autoSize={{ minRows: 3 }} 
                    style={{
                      background: "#fff", // changed from #222
                      color: "#333", // changed from 'white'
                      border: "1px solid #d9d9d9",
                      marginBottom: '12px',
                    }} 
                  />

                  <Title level={4} style={{ marginTop: 0, marginBottom: 16, textAlign: "left"}}>
                    Further Information
                  </Title>
                  <TextArea 
                    value={other} 
                    onChange={(e) => setOther(e.target.value)}
                    autoSize={{ minRows: 3 }} 
                    style={{
                      background: "#fff", // changed from #222
                      color: "#333", // changed from 'white'
                      border: "1px solid #d9d9d9",
                    }} 
                  />
                </div>
              </Col>
            )}

            {/* Buttons */}
            <Col
              span={24}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '16px',
                marginTop: '16px'
              }}
            >
              <Button 
                type="default" 
                icon={<CloseCircleOutlined />} 
                size="large" 
                onClick={handleDeleteVacancy}
              >
                Cancel
              </Button>

              {createdVacancy ? (
                <>
                  <Button 
                    type="default" 
                    icon={<SaveOutlined />} 
                    size="large"
                    onClick={() => handleUpdateVacancy("Draft")}
                  >
                    Save As Draft
                  </Button>

                  <Button 
                    type="primary" 
                    icon={<CloudUploadOutlined />} 
                    size="large"
                    onClick={() => handleUpdateVacancy("Open")}
                  >
                    Publish Vacancy
                  </Button>
                </>
              ) : (
                <Button 
                  type="primary" 
                  icon={<PlayCircleOutlined />} 
                  size="large"
                  disabled={isCreateDisabled}
                  onClick={handleCreateVacancy}
                  loading={loading}
                >
                  Create Vacancy
                </Button>
              )}
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateVacancy;