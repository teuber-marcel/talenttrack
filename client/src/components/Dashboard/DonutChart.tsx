import React, { useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

// Register the necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

interface Vacancy {
  status: 'Open' | 'Filled' | 'Draft' | 'Interview';
  // other properties can be added here
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

  // Fetch vacancies and count status occurrences
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

  // Update the labels to match the Vacancy status values
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
          'rgba(200, 50, 50, 0.9)', 
          'rgba(30, 150, 80, 0.9)', // Dark green
          'rgba(200, 100, 20, 0.9)', // Muted orange
          'rgba(60, 120, 200, 0.9)', // Deep blue
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
          label: (tooltipItem: any) => ` ${tooltipItem.label}: ${tooltipItem.raw}`,
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

  // Handler for chart clicks using the chart reference
  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!chartRef.current) return;
    // Retrieve the chart elements that were clicked on using the 'nearest' mode.
    const elements = chartRef.current.getElementsAtEventForMode(
      event,
      'nearest',
      { intersect: true },
      false
    );
    if (elements.length > 0) {
      // Get the first clicked element and its index
      const element = elements[0];
      const index = element.index;
      // Use the chart label as the status to filter by
      const clickedStatus = chartLabels[index];
      
      // Redirect with the status as a query parameter
      window.location.href = `/VacanciesOverview?status=${encodeURIComponent(clickedStatus)}`;
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '10px', color: 'white' }}>
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
