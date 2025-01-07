import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFileAlt, faUsers, faCalendarAlt, faCog } from '@fortawesome/free-solid-svg-icons';

const NavigationBar: React.FC = () => {
  return (
  
    <div
      style={{
        width: '80px', // Adjust the width for a compact sidebar
        backgroundColor: '#333333',
        padding: '20px 10px',
        borderRadius: '15px',
        margin: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100vh',
      }}
    >
      {/* Logo Placeholder */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ textAlign: 'center', color:'white'}}>Logo</h2>
      </div>

      <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', width: '100%' }}>
        <li style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
          <Link href="/Dashboard">
            <div style={{ backgroundColor: '#0070f3', borderRadius: '50%', padding: '10px' }}>
              <FontAwesomeIcon
                icon={faHome}
                style={{ fontSize: '30px', color: '#ffffff' }} // Adjust size and color here
              />
            </div>
          </Link>
        </li>
        <li style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
          <Link href="/CreateVacancy">
            <FontAwesomeIcon
              icon={faFileAlt}
              style={{ fontSize: '30px', color: '#0070f3' }}
            />
          </Link>
        </li>
        <li style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
          <Link href="/Applicants">
            <FontAwesomeIcon
              icon={faUsers}
              style={{ fontSize: '30px', color: '#0070f3' }}
            />
          </Link>
        </li>
        <li style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
          <Link href="/Calendar">
            <FontAwesomeIcon
              icon={faCalendarAlt}
              style={{ fontSize: '30px', color: '#0070f3' }}
            />
          </Link>
        </li>
      </ul>

      {/* Settings Icon at the Bottom */}
      <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
        <Link href="/Settings">
          <FontAwesomeIcon
            icon={faCog}
            style={{ fontSize: '30px', color: '#0070f3' }}
          />
        </Link>
      </div>
    </div>
  );
};

export default NavigationBar;