import React from 'react';
import '../app/globals.css';
import NavigationBar from '../components/NavigationBar';
import DonutChart from '../components/DonutChart'; // Donut Chart component
import ApplicantDashboard from '../components/ApplicantDashboard'; // Applicant Dashboard component

const Dashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <NavigationBar />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '20px',
          overflow: 'auto', // Prevent overflow inside this container
        }}
      >
        {/* Donut Chart and Applicant Dashboard side by side */}
        <div style={{ flex: 1, marginRight: '20px', height: '500px' }}>
          <DonutChart />
        </div>
        <div style={{ flex: 1, height: '500px' }}>
          <ApplicantDashboard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
