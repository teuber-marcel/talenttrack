import React, { useState } from 'react';
import '../app/globals.css';
import { Layout, Row, Col, Button, Input, message } from 'antd';
import { CloseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Sidebar from '../components/Global/Sidebar.jsx';
import RadioButtonGroup from '../components/CreateVacancy/RadioButtonGroup.jsx';
import CheckboxGroup from '../components/CreateVacancy/CheckboxGroup.jsx';
import VacancyTitleInput from '../components/CreateVacancy/VacancyTitleInput.jsx';

const { Header, Content } = Layout;
const { TextArea } = Input;

const CreateVacancy = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedHierarchies, setSelectedHierarchies] = useState([]);
  const [vacancyTitle, setVacancyTitle] = useState("");
  const [createdVacancy, setCreatedVacancy] = useState(null); // Speichert erstellte Vacancy
  const [loading, setLoading] = useState(false);

  const isCreateDisabled = 
    !selectedDepartment || 
    selectedHierarchies.length === 0 || 
    vacancyTitle.length < 3;

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
      message.success('Vacancy successfully created!');

    } catch (error) {
      console.error("Error creating vacancy:", error);
      message.error("Error creating vacancy");
    }
    setLoading(false);
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
                <RadioButtonGroup onChange={setSelectedDepartment} />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: 16, minHeight: 240, background: '#333', borderRadius: 8, color: 'white', display: 'flex', justifyContent: 'center' }}>
                <CheckboxGroup onChange={setSelectedHierarchies} />
              </div>
            </Col>
            <Col span={24}>
              <div style={{ padding: 16, minHeight: 140, background: '#333', borderRadius: 8, color: 'white' }}>
                <VacancyTitleInput onChange={setVacancyTitle} />
              </div>
            </Col>

            {/* Beschreibung, Anforderungen, Sonstiges - Felder */}
            {createdVacancy && (
              <Col span={24}>
                <div style={{ background: '#333', padding: '16px', borderRadius: '8px', marginTop: '16px' }}>
                  <h3 style={{ color: 'white', marginBottom: '8px' }}>Description</h3>
                  <TextArea 
                    value={createdVacancy.description} 
                    autoSize={{ minRows: 3 }} 
                    style={{ background: '#222', color: 'white', border: 'none', marginBottom: '12px' }} 
                    readOnly 
                  />

                  <h3 style={{ color: 'white', marginBottom: '8px' }}>Requirements</h3>
                  <TextArea 
                    value={createdVacancy.requirements} 
                    autoSize={{ minRows: 3 }} 
                    style={{ background: '#222', color: 'white', border: 'none', marginBottom: '12px' }} 
                    readOnly 
                  />

                  <h3 style={{ color: 'white', marginBottom: '8px' }}>Other</h3>
                  <TextArea 
                    value={createdVacancy.other} 
                    autoSize={{ minRows: 3 }} 
                    style={{ background: '#222', color: 'white', border: 'none' }} 
                    readOnly 
                  />
                </div>
              </Col>
            )}

            {/* Buttons */}
            <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button type="default" icon={<CloseCircleOutlined />} size="large">
                Cancel
              </Button>

              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />} 
                size="large"
                disabled={isCreateDisabled}
                onClick={handleCreateVacancy}
                loading={loading}
                style={{ marginLeft: '16px' }}
              >
                Create Vacancy
              </Button>
            </Col>
          </Row>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateVacancy;