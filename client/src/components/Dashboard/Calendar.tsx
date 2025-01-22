import React, { useEffect, useState } from 'react';
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
  interviewDate: string; // Stored as ISO string
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
          interviewDate: new Date(event.interviewDate), // Parse ISO string to Date object
          applicant,
        };
      })
    );
    setEvents(formattedData);
  };

  const interviewDates = events.map((event) =>
    new Date(event.interviewDate).toDateString()
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
            className="dark-theme-calendar"
            locale="en-GB" // Set the locale to English
            tileClassName={({ date }) =>
              interviewDates.includes(date.toDateString())
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
              backgroundColor: '#333',
              color: '#fff',
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
          <h3 style={{ color: 'white', textAlign: 'center', paddingBottom: '10px' }}>
            {date
              ? `Interviews on ${date.toLocaleDateString('en-GB')}`
              : 'Coming Up'}
          </h3>
          <ul style={{ listStyleType: 'none', padding: 0, color: '#ddd', textAlign: 'left' }}>
            {events
              .filter((event) => {
                if (!date) return false;
                const eventDate = new Date(event.interviewDate);
                return (
                  eventDate.getFullYear() === date.getFullYear() &&
                  eventDate.getMonth() === date.getMonth() &&
                  eventDate.getDate() === date.getDate()
                );
              })
              .sort((a, b) => {
                const timeA = new Date(a.interviewDate).getTime();
                const timeB = new Date(b.interviewDate).getTime();
                return timeA - timeB;
              })
              .map((event, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  {new Date(event.interviewDate).toLocaleString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}{' '}
                  | {event.applicant?.prename} {event.applicant?.surname}
                </li>
              ))}
          </ul>
          {/* Show message if no interviews are scheduled */}
          {events.filter((event) => {
            if (!date) return false;
            const eventDate = new Date(event.interviewDate);
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
