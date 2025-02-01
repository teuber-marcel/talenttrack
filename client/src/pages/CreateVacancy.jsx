import React, { useState } from 'react';
import '../app/globals.css';
import { Layout, Row, Col, Button, Input, message } from 'antd';
import { CloseCircleOutlined, PlayCircleOutlined, SaveOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import Sidebar from '../components/Global/Sidebar.jsx';
import RadioButtonGroup from '../components/CreateVacancy/RadioButtonGroup.jsx';
import CheckboxGroup from '../components/CreateVacancy/CheckboxGroup.jsx';
import VacancyTitleInput from '../components/CreateVacancy/VacancyTitleInput.jsx';
import { deleteVacancy } from '../services/vacancyService.js';

const { Header, Content } = Layout;
const { TextArea } = Input;

const CreateVacancy = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedHierarchies, setSelectedHierarchies] = useState([]);
  const [vacancyTitle, setVacancyTitle] = useState("");
  const [createdVacancy, setCreatedVacancy] = useState(null); // Speichert erstellte Vacancy
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [other, setOther] = useState("");
  
  const router = useRouter();

  const isCreateDisabled = 
    !selectedDepartment || 
    selectedHierarchies.length === 0 || 
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
          hierarchy: selectedHierarchies[0], // Nur eine Hierarchie nehmen
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create vacancy');
      }

      const data = await response.json();
      setCreatedVacancy(data); // Speichert die erstellte Vacancy
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

        message.success(`Vacancy ${status ? "published" : "saved as draft"} successfully!`);
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
    <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.3s ease", backgroundColor: 'var(--background)', minHeight: '100vh', display: 'flex' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout style={{ background: 'var(--background)' }}>  
        <Header style={{ color: 'white', background: 'var(--background)', padding: 0, textAlign: 'center', fontSize: '24px' }}>
          Create Vacancy
        </Header>
        <Content style={{ margin: '16px' }}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <div style={{ padding: 16, minHeight: 240, background: '#333', borderRadius: 8, color: 'white', display: 'flex', justifyContent: 'center' }}>
                <RadioButtonGroup onChange={setSelectedDepartment} disabled={!!createdVacancy} />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: 16, minHeight: 240, background: '#333', borderRadius: 8, color: 'white', display: 'flex', justifyContent: 'center' }}>
                <CheckboxGroup onChange={setSelectedHierarchies} disabled={!!createdVacancy} />
              </div>
            </Col>
            <Col span={24}>
              <div style={{ padding: 16, minHeight: 140, background: '#333', borderRadius: 8, color: 'white' }}>
                <VacancyTitleInput onChange={setVacancyTitle} disabled={!!createdVacancy} />
              </div>
            </Col>

            {/* Beschreibung, Anforderungen, Sonstiges - Felder */}
            {createdVacancy && (
              <Col span={24}>
                <div style={{ background: '#333', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                  <h3 style={{ color: 'white', marginBottom: '8px' }}>Description</h3>
                  <TextArea 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    autoSize={{ minRows: 3 }} 
                    style={{ background: '#222', color: 'white', border: 'none', marginBottom: '12px' }} 
                  />

                  <h3 style={{ color: 'white', marginBottom: '8px' }}>Requirements</h3>
                  <TextArea 
                    value={requirements} 
                    onChange={(e) => setRequirements(e.target.value)}
                    autoSize={{ minRows: 3 }} 
                    style={{ background: '#222', color: 'white', border: 'none', marginBottom: '12px' }} 
                  />

                  <h3 style={{ color: 'white', marginBottom: '8px' }}>Other</h3>
                  <TextArea 
                    value={other} 
                    onChange={(e) => setOther(e.target.value)}
                    autoSize={{ minRows: 3 }} 
                    style={{ background: '#222', color: 'white', border: 'none' }} 
                  />
                </div>
              </Col>
            )}

            {/* Buttons */}
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
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