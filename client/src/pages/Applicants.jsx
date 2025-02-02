import React, { useState } from 'react';
import '../app/globals.css';
import { Layout, Menu } from 'antd';
import theme from 'antd/es/theme';
import Sidebar from '../components/Global/Sidebar';


const {Header, Content } = Layout;


const test = () => {
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
           Applicants Overview
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{ color: 'white' }} >
            Page is still under construction! We appreciate your patience.
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default test;
