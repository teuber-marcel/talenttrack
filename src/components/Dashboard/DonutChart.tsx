import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import BackgroundBox from '../Global/BackgroundBox'; // Import BackgroundBox component
import { urlToHttpOptions } from 'url';

// Registering the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const DonutChart: React.FC = () => {
  const data = {
    labels: ['Open', 'Filled', 'Drafted', 'Interviewing'],
    datasets: [
      {
        data: [100, 62, 50, 28],
        backgroundColor: [
          'rgba(0, 112, 243, 0.7)',
          'rgba(39, 174, 96, 0.7)',
          'rgba(243, 156, 18, 0.7)',
          'rgba(52, 152, 219, 0.7)',
        ],
        borderColor: [
          'rgba(0, 112, 243, 1)',
          'rgba(39, 174, 96, 1)',
          'rgba(243, 156, 18, 1)',
          'rgba(52, 152, 219, 1)',
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
          label: (tooltipItem: any) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
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
        Status of all Positions
      </h3>
      <div style={{ position: 'relative', height: '100%' }}>
        <Doughnut data={data} options={options} />
      </div>
    </BackgroundBox>
  );
};

export default DonutChart;
