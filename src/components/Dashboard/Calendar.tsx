import React from 'react';
import BackgroundBox from '../Global/BackgroundBox'; // Import BackgroundBox component

const Calendar: React.FC = () => {
  const events = [
    { time: '8 AM', description: 'Interview 1: Max Mustermann' },
    { time: '10 AM', description: 'Interview 2: John Doe' },
    { time: '1 PM', description: 'Interview 3: Leo Caprio' },
  ];

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
        <div style={{ width: '60%' }}>
          <h3 style={{ marginBottom: '10px', color: 'white' }}>October 2024</h3>
          <table
            style={{
              borderCollapse: 'collapse',
              width: '100%',
              color: 'white',
            }}
          >
            <thead>
              <tr>
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                  <th
                    key={day}
                    style={{
                      padding: '5px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: '#ddd',
                    }}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [null, null, null, 1, 2, 3, 4],
                [5, 6, 7, 8, 9, 10, 11],
                [12, 13, 14, 15, 16, 17, 18],
                [19, 20, 21, 22, 23, 24, 25],
                [26, 27, 28, 29, 30, 31, null],
              ].map((week, i) => (
                <tr key={i}>
                  {week.map((day, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '10px',
                        textAlign: 'center',
                        backgroundColor: day === 8 ? '#0070f3' : 'transparent',
                        color: day === 8 ? '#fff' : '#ccc',
                        borderRadius: day === 8 ? '50%' : '0',
                      }}
                    >
                      {day || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Events Section */}
        <div
          style={{
            paddingLeft: '20px',
            borderLeft: '1px solid #444',
            width: '35%',
          }}
        >
          <h3 style={{ color: 'white' }}>Coming Up Today</h3>
          <ul style={{ listStyleType: 'none', padding: 0, color: '#ddd' }}>
            {events.map((event, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>{event.time}</strong>
                <p style={{ margin: 0 }}>{event.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BackgroundBox>
  );
};

export default Calendar;
