import React from 'react';
import BackgroundBox from '../Global/BackgroundBox';

const applicants = [
  {
    name: 'Helena',
    position: 'Senior Data Scientist',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  {
    name: 'Oscar',
    position: 'Junior Data Scientist',
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
  },
  {
    name: 'Daniel',
    position: 'Project Management - Digital Transformation',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
  {
    name: 'Daniel Jay Park',
    position: 'Junior Software Developer',
    image: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
];

const ApplicantDashboard: React.FC = () => {
  return (
    <BackgroundBox width="100%" height="100%">
      <h3 style={{ textAlign: 'center', marginBottom: '20px', color: 'white' }}>
        New Applicants
      </h3>
      <div style={{ overflowY: 'auto', height: '80%' }}>
        {applicants.map((applicant, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '15px',
              padding: '10px',
              borderBottom: '1px solid #444444',
            }}
          >
            <img
              src={applicant.image}
              alt={applicant.name}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                marginRight: '15px',
              }}
            />
            <div>
              <h4 style={{ margin: 0, color: 'white' }}>{applicant.name}</h4>
              <p style={{ margin: 0, color: '#7f8c8d' }}>{applicant.position}</p>
            </div>
          </div>
        ))}
      </div>
    </BackgroundBox>
  );
};

export default ApplicantDashboard;
