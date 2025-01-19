import React, { useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import BackgroundBox from '../Global/BackgroundBox'; // Import BackgroundBox component

// Registering the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

interface Vacancy {
  status: 'Open' | 'Filled' | 'Draft' | 'Interview';
  // other properties of Vacancy can be added here
}

const DonutChart: React.FC = () => {

  const[vacancies, setVacancies] = React.useState<Vacancy[]>([]);
  const[statusCounts, setStatusCounts] = React.useState({ Open: 0, Filled: 0, Draft: 0, Interview: 0 });
  
  useEffect(() => {
    getVacancies();
  }, []);

  //data for the chart
  const getVacancies = async () => {
    const response = await fetch('http://localhost:5555/api/vacancies');
    const data: Vacancy[] = await response.json();
    setVacancies(data);
    countStatus(data);
  }

  const countStatus = (data: Vacancy[]) => {
    const counts = { Open: 0, Filled: 0, Draft: 0, Interview: 0 };
    data.forEach(vacancy => {
      if (counts[vacancy.status] !== undefined) {
        counts[vacancy.status]++;
      }
    });
    setStatusCounts(counts);
  }

  const totalVacancies = statusCounts.Open + statusCounts.Filled + statusCounts.Draft + statusCounts.Interview;

  const data = {
    labels: ['Open', 'Filled', 'Drafted', 'Interviewing'],
    datasets: [
      {
        data: [statusCounts.Open, statusCounts.Filled, statusCounts.Draft, statusCounts.Interview],
        backgroundColor: [
          'rgba(200, 50, 50, 0.9)', 
          'rgba(30, 150, 80, 0.9)', // Dark green
          'rgba(200, 100, 20, 0.9)', // Muted orange
          'rgba(60, 120, 200, 0.9)'  // Deep blue
        ],
        borderColor: [
          'rgba(200, 50, 50, 0.9)', 
          'rgba(30, 150, 80, 0.9)', 
          'rgba(200, 100, 20, 0.9)', 
          'rgba(60, 120, 200, 0.9)'
        ],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow chart to resize based on its container
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          },
          color: 'white',
        },
      },
      tooltip: {
        callbacks: {
          title: () => '', 
          label: (tooltipItem: any) => {
            return ` ${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 10,
      },
      datalabels: { 
        display: true,
        color: 'white',
        formatter: (value: any) => `${value}`,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  return (
    <BackgroundBox width="100%" height="500px"> {/* Adjusted height for better fit */}
      <h3 style={{ textAlign: 'center', marginBottom: '20px'}}>
        Status of all Positions | Total: {totalVacancies}
      </h3>
      <div style={{ position: 'relative', height: '100%' }}>
        <Doughnut data={data} options={options} />
      </div>
    </BackgroundBox>
  );
};

export default DonutChart;
