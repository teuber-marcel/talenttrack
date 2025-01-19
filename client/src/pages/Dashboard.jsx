import React from 'react';
import '../app/globals.css';
import NavigationBar from '../components/Global/NavigationBar';
import DonutChart from '../components/Dashboard/DonutChart'; // Donut Chart component
import ApplicantDashboard from '../components/Dashboard/ApplicantDashboard'; // Applicant Dashboard component
import Calendar  from '../components/Dashboard/Calendar'; // Calendar component

const Dashboard = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <NavigationBar />
      <div
        style={{
          flex: 1,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}
      >
        {/* Top Section: Donut Chart and Applicant Dashboard */}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ flex: 1, marginRight: '20px' }}>
            <DonutChart />
          </div>
          <div style={{ flex: 1 }}>
            <ApplicantDashboard />
          </div>
        </div>

        {/* Bottom Section: Calendar */}
        <Calendar />
      </div>
    </div>
  );
};

export default Dashboard;
