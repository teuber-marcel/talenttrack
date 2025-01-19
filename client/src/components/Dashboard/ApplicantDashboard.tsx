import React, { useEffect, useState } from 'react';
import BackgroundBox from '../Global/BackgroundBox';
import { FaUserCircle } from 'react-icons/fa';

const ApplicantDashboard: React.FC = () => {

  interface Applicant {
    photo?: string;
    prename: string;
    surname: string;
    email: string;
    createdAt: string;
    vacancy?: string;
  }

  interface Vacancy {
    id: string;
    title: string;
    description: string;
  }

  const [applicants2, setApplicants] = useState<Applicant[]>([]);
  const [vacancyTitles, setVacancyTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    getApplicants();
  }, []);

  const getApplicants = async () => {
    const response = await fetch('http://localhost:5555/api/applicants');
    const data = await response.json();
    const sortedApplicants = data.sort((a: { createdAt: string }, b: { createdAt: string }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setApplicants(sortedApplicants);
    fetchVacancyTitles(sortedApplicants);
  }

  const fetchVacancyTitles = async (applicants: Applicant[]) => {
    const titles: { [key: string]: string } = {};
    for (const applicant of applicants) {
      if (applicant.vacancy) {
        const title = await getVacancyTitlebyID(applicant.vacancy);
        titles[applicant.vacancy] = title;
      }
    }
    setVacancyTitles(titles);
  }

  const getVacancyTitlebyID = async (id: string) => {
    const response = await fetch(`http://localhost:5555/api/vacancies/${id}`);
    const data = await response.json();
    return data.title;
  }

  return (
    <BackgroundBox width="100%">
      <h3 style={{ textAlign: 'center', marginBottom: '10px', color: 'white' }}>
        New Applicants
      </h3>
      <div style={{ overflowY: 'auto', height: '90%', paddingTop: '10px' }}>
        {applicants2.map((applicant, index) => (
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
            {applicant.photo ? (
              <img
                src={applicant.photo}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginRight: '15px',
                }}
              />
            ) : (
              <FaUserCircle
                style={{
                  width: '40px',
                  height: '40px',
                  color: '#7f8c8d',
                  marginRight: '15px',
                }}
              />
            )}
            <div>
              <h4 style={{ margin: 0, color: 'white' }}>{`${applicant.prename} ${applicant.surname}`}</h4>
              <p style={{ margin: 0, color: '#7f8c8d' }}>{applicant.vacancy ? vacancyTitles[applicant.vacancy] || 'Loading...' : 'No Vacancy'} | Joined: {new Date(applicant.createdAt).toLocaleDateString('en-GB')}</p>
            </div>
          </div>
        ))}
      </div>
    </BackgroundBox>
  );
};

export default ApplicantDashboard;