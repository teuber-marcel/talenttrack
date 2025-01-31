import React, { useState } from 'react';
import '../app/globals.css';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Row, Col } from 'antd';
import theme from 'antd/es/theme';
import DonutChart from '../components/Dashboard/DonutChart';
import ApplicantDashboard from '../components/Dashboard/ApplicantDashboard';
import CalendarComponent from '../components/Dashboard/Calendar'; // Import CalendarComponent
import Sidebar from '../components/Global/Sidebar';


const { Sider, Header, Content } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem('Dashboard', '1', <PieChartOutlined />),
  getItem('Vacancies', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />),
  getItem('Team', 'sub2', <TeamOutlined />),
  getItem('Files', '9', <FileOutlined />),
];

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Extract color and border-radius tokens from Ant Design theme
  const {
    token: { borderRadiusLG },
  } = theme.useToken();

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
          TalentTrack Dashboard
        </Header>
        <Content style={{ margin: '16px' }}>
          <div>
            {/* Dashboard Layout */}
            <Row gutter={[16, 16]}>
              {/* DonutChart */}
              <Col span={12}>
                <div
                  style={{
                    padding: 16,
                    minHeight: 420,
                    maxHeight: 420,
                    background: '#333',
                    borderRadius: borderRadiusLG,
                    textAlign: 'center',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'center',
                   
                  }}
                >
                  <div style={{ width: '95%', height: '95%' }}>
                    <DonutChart />
                  </div>
                </div>
              </Col>

              {/* ApplicantDashboard */}
              <Col span={12}>
                <div
                  style={{
                    padding: 16,
                    minHeight: 420,
                    maxHeight: 420,
                    background: '#333',
                    borderRadius: borderRadiusLG,
                    textAlign: 'center',
                    color: 'white',
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ width: '95%', height: '95%' }}>
                    <ApplicantDashboard />
                  </div>
                </div>
              </Col>

              {/* Full-Width Calendar */}
              <Col span={24}>
                <div
                  style={{
                    padding: 16,
                    minHeight: 400,
                    background: '#333',
                    borderRadius: borderRadiusLG,
                    textAlign: 'center',
                    color: 'white',
                  }}
                >
                  <div style={{ width: '100%', height: '100%' }}>
                    <CalendarComponent />
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
