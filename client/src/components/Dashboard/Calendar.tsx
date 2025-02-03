import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar'; // Import react-calendar
import 'react-calendar/dist/Calendar.css'; // Import react-calendar styles
import './Calendar.css'; // Import custom styles
import Link from 'next/link';

interface Applicant {
  _id: string;
  prename: string;
  surname: string;
}

interface Interview {
  time: string;
  description: string;
  interviewStartDate: string; // Stored as ISO string
  interviewEndDate: string; // Stored as ISO string
  applicant: Applicant;
}

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<Interview[]>([]);
  const [date, setDate] = useState<Date | null>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date | null>(null); // Null by default

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
        const applicantId = event.applicant as unknown as string; // Ensure this is a string ID
        const applicant = await getApplicantById(applicantId);
        return {
          ...event,
          interviewStartDate: new Date(event.interviewStartDate), // Parse ISO string to Date object
          interviewEndDate: new Date(event.interviewEndDate), // Parse ISO string to Date object
          applicant,
        };
      })
    );
    setEvents(formattedData);
    
  };

  const interviewStartDates = events.map((event) =>
    new Date(event.interviewStartDate).toDateString()
  );

  const interviewEndDates = events.map((event) =>
    new Date(event.interviewEndDate).toDateString()
  );



  const handleTodayClick = () => {
    const today = new Date();
    setDate(today); // Reset the selected date
    setActiveStartDate(today); // Reset the visible month to today
  };

  const handleActiveStartDateChange = ({ activeStartDate }: { activeStartDate: Date | null }) => {
    setActiveStartDate(activeStartDate); // Allow navigation
  };

  return (
    <div    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
        }}
      >
        {/* Calendar Section */}
        <div style={{ width: '45%' }}>
          <Calendar
            onChange={(value) => setDate(value as Date)}
            value={date}
            className="light-theme-calendar"
            locale="en-GB" // Set the locale to English
            tileClassName={({ date }) =>
              interviewStartDates.includes(date.toDateString())
                ? 'highlighted-date'
                : undefined
            }
            activeStartDate={activeStartDate || undefined} // Only set if provided
            onActiveStartDateChange={handleActiveStartDateChange} // Track navigation
          />
          <button
            onClick={handleTodayClick}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              backgroundColor: '#03213F', // Updated dark blue color
              color: 'white',
              border: '1px solid #555',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Today
          </button>
        </div>

        {/* Events Section */}
        <div
          style={{
            paddingLeft: '50px',
            borderLeft: '1px solid #444',
            width: '50%',
          }}
        >
          <h3 style={{ color: 'black ', textAlign: 'center', paddingBottom: '10px' }}>
            {date
              ? `Interviews on ${date.toLocaleDateString('en-GB')}`
              : 'Coming Up'}
          </h3>
          <ul style={{ listStyleType: 'none', padding: 0, color: 'black', textAlign: 'left' }}>
            {events
              .filter((event) => {
                if (!date) return false;
                const eventDate = new Date(event.interviewStartDate);
                return (
                  eventDate.getFullYear() === date.getFullYear() &&
                  eventDate.getMonth() === date.getMonth() &&
                  eventDate.getDate() === date.getDate()
                );
              })
              .sort((a, b) => {
                const timeA = new Date(a.interviewStartDate).getTime();
                const timeB = new Date(b.interviewStartDate).getTime();
                return timeA - timeB;
              })
              .map((event, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  {new Date(event.interviewStartDate).toLocaleString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}{' '} - {' '}
                   {new Date(event.interviewEndDate).toLocaleString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })} {' '}
                  | {event.applicant?.prename} {event.applicant?.surname} | {' '}
                  <Link href={`InterviewPrep?applicantId=${event.applicant?._id}`}>
                    Interview Preparation
                  </Link>
                  </li>
              ))} 
          </ul>
          {/* Show message if no interviews are scheduled */}
          {events.filter((event) => {
            if (!date) return false;
            const eventDate = new Date(event.interviewStartDate);
            return (
              eventDate.getFullYear() === date.getFullYear() &&
              eventDate.getMonth() === date.getMonth() &&
              eventDate.getDate() === date.getDate()
            );
          }).length === 0 && (
            <p style={{ color: '#ddd' }}>No interviews scheduled for this day.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
