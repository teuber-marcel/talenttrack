import React, { useState } from 'react';
import '../app/globals.css';
import { Layout, Menu, Row, Col, Space, Button } from 'antd';
import { CloseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import theme from 'antd/es/theme';
import Sidebar from '../components/Global/Sidebar.jsx';
import RadioButtonGroup from '../components/CreateVacancy/RadioButtonGroup.jsx';
import CheckboxGroup from '../components/CreateVacancy/CheckboxGroup.jsx';
import VacancyTitleInput from '../components/CreateVacancy/VacancyTitleInput.jsx';


const {Header, Content } = Layout;


const CreateVacancy = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedHierarchies, setSelectedHierarchies] = useState([]);
  const [vacancyTitle, setVacancyTitle] = useState("");

  // Extract color and border-radius tokens from Ant Design theme
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  const isCreateDisabled = 
    !selectedDepartment || 
    selectedHierarchies.length === 0 || 
    vacancyTitle.length < 3;

  return (
    <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.3s ease", backgroundColor: 'var(--background)', minHeight: '100vh', height: '100%', display: 'flex' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Layout */}
      <Layout style={{ background: 'var(--background)' }}>  
        <Header
          style={{
            color: 'white',
            background: 'var(--background)',
            padding: 0,
            textAlign: 'center',
            fontSize: '24px',
          }}
        >
          Create Vacancy
        </Header>
        <Content style={{ margin: '16px' }}>
          <div>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div
                  style={{
                  padding: 16,
                  minHeight: 240,
                  maxHeight: 240,
                  background: '#333',
                  borderRadius: borderRadiusLG,
                  textAlign: 'center',
                  color: 'white',
                  overflowY: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  }}
                >
                  <div style={{ width: '95%', height: '95%' }}>
                    <RadioButtonGroup onChange={setSelectedDepartment} />
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div
                  style={{
                  padding: 16,
                  minHeight: 240,
                  maxHeight: 240,
                  background: '#333',
                  borderRadius: borderRadiusLG,
                  textAlign: 'center',
                  color: 'white',
                  overflowY: 'auto',
                  display: 'flex',
                  justifyContent: 'center',
                  }}
                >
                  <div style={{ width: '95%', height: '95%' }}>
                    <CheckboxGroup onChange={setSelectedHierarchies} />
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div
                  style={{
                    padding: 16,
                    minHeight: 140,
                    maxHeight: 140,
                    background: '#333',
                    borderRadius: borderRadiusLG,
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  <div style={{ width: '100%', height: '100%' }}>
                    <VacancyTitleInput onChange={setVacancyTitle} />
                  </div>
                </div>
              </Col>
            </Row>
            <div style={{ 
              position: 'absolute', 
              bottom: '16px', 
              right: '16px', 
              display: 'flex', 
              gap: '16px' 
            }}>
              {/* Close Button */}
              <Button 
                type="default" 
                icon={<CloseCircleOutlined />} 
                size="large"
              >
                Cancel
              </Button>

              {/* Create Vacancy Button */}
              <Button 
                type="primary" 
                icon={<PlayCircleOutlined />} 
                size="large"
                disabled={isCreateDisabled}
                className={isCreateDisabled ? "custom-disabled-button" : ""}
              >
                Create Vacancy
              </Button>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreateVacancy;