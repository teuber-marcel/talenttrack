import React, { useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

interface Vacancy {
  status: 'Open' | 'Filled' | 'Draft' | 'Interview';
}

const DonutChart: React.FC = () => {
  const chartRef = useRef<any>(null);
  const [vacancies, setVacancies] = React.useState<Vacancy[]>([]);
  const [statusCounts, setStatusCounts] = React.useState({
    Open: 0,
    Filled: 0,
    Draft: 0,
    Interview: 0,
  });

  useEffect(() => {
    getVacancies();
  }, []);

  const getVacancies = async () => {
    const response = await fetch('http://localhost:5555/api/vacancies');
    const data: Vacancy[] = await response.json();
    setVacancies(data);
    countStatus(data);
  };

  const countStatus = (data: Vacancy[]) => {
    const counts = { Open: 0, Filled: 0, Draft: 0, Interview: 0 };
    data.forEach(vacancy => {
      if (counts[vacancy.status] !== undefined) {
        counts[vacancy.status]++;
      }
    });
    setStatusCounts(counts);
  };

  const totalVacancies =
    statusCounts.Open +
    statusCounts.Filled +
    statusCounts.Draft +
    statusCounts.Interview;

  const chartLabels = ['Open', 'Filled', 'Draft', 'Interview'];

  const data = {
    labels: chartLabels,
    datasets: [
      {
        data: [
          statusCounts.Open,
          statusCounts.Filled,
          statusCounts.Draft,
          statusCounts.Interview,
        ],
        backgroundColor: [
          '#dc3545', // Red
          '#198754', // Green
          '#fd7e14', // Orange
          '#0d6efd', // Blue
        ],
        borderColor: [
          '#dc3545',
          '#198754',
          '#fd7e14',
          '#0d6efd',
        ],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            family: 'Arial, sans-serif',
          },
          color: '#212529',
        },
      },
      tooltip: {
        callbacks: {
          title: () => '',
          label: (tooltipItem: any) => ` ${tooltipItem.label}: ${tooltipItem.raw}`,
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#000',
        bodyColor: '#000',
        padding: 10,
      },
    },
    animation: {
      animateScale: true,
      animateRotate: true,
    },
  };

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    const elements = chartRef.current.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      false
    );
    if (elements.length > 0) {
      const element = elements[0];
      const index = element.index;
      const clickedStatus = chartLabels[index];
      window.location.href = `/VacanciesOverview?status=${encodeURIComponent(clickedStatus)}`;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#ffffff' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px', color: '#212529' }}>
        Status of all Positions | Total: {totalVacancies}
      </h3>
      <div style={{ position: 'relative', height: '300px', width: 'auto', margin: '0 auto', alignSelf: 'top' }}>
        <Doughnut 
          ref={chartRef} 
          data={data} 
          options={options} 
          onClick={handleSegmentClick} 
        />
      </div>
    </div>
  );
};

export default DonutChart;
