import React, { useEffect, useState } from 'react';
import BackgroundBox from '../Global/BackgroundBox'; // Import BackgroundBox component
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import react-calendar styles
import './Calendar.css'; // Import custom styles

interface Applicant {
  id: string;
  prename: string;
  surname: string;
}

interface Interview {
  time: string;
  description: string;
  interviewDate: string;
  applicant: Applicant;
}

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<Interview[]>([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getInterviews();
  }, []);

  const getApplicantById = async (id: string): Promise<Applicant> => {
    const response = await fetch(`http://localhost:5555/api/applicants/${id}`);
    const data = await response.json();
    return data;
  };

  const getInterviews = async () => {
    const response = await fetch('http://localhost:5555/api/interviews');
    const data = await response.json();
    const formattedData = await Promise.all(
      data.map(async (event: Interview) => {
        const applicant = await getApplicantById(event.applicant);
        return {
          ...event,
          interviewDate: new Date(event.interviewDate).toLocaleString('en-GB', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }).replace(',', ' |'),
          applicant,
        };
      })
    );
    setEvents(formattedData);
  };

  return (
    <BackgroundBox width="100%" height="auto"> {/* Wrap the calendar in BackgroundBox */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
        }}
      >
        {/* Calendar Section */}
        <div style={{ width: '70%' }}>
          <Calendar
            onChange={setDate}
            value={date}
            className="dark-theme-calendar"
            locale="en-US" // Set the locale to English
          />
        </div>

        {/* Events Section */}
        <div
          style={{
            paddingLeft: '20px',
            borderLeft: '1px solid #444',
            width: '30%',
          }}
        >
          <h3 style={{ color: 'white' }}>Coming Up</h3>
          <ul style={{ listStyleType: 'none', padding: 0, color: '#ddd' }}>
            {events.map((event, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                {event.interviewDate} | {event.applicant?.prename} {event.applicant?.surname}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BackgroundBox>
  );
};

export default CalendarComponent;