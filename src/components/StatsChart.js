
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const StatsChart = ({ stats }) => {
  // Default empty stats if none provided
  const applicationStats = stats || { applied: 0, interview: 0, offer: 0, rejected: 0 };
  
  const data = {
    labels: ['Applied', 'Interview', 'Offer', 'Rejected'],
    datasets: [
      {
        data: [
          applicationStats.applied || 0, 
          applicationStats.interview || 0, 
          applicationStats.offer || 0, 
          applicationStats.rejected || 0
        ],
        backgroundColor: [
          '#36A2EB', // Applied (blue)
          '#FFCE56', // Interview (yellow)
          '#4BC0C0', // Offer (teal)
          '#FF6384'  // Rejected (red)
        ],
        borderColor: [
          '#fff',
          '#fff',
          '#fff',
          '#fff'
        ],
        borderWidth: 2,
      },
    ],
  };
  
  const options = {
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: true,
  };
  
  // Calculate total applications
  const totalApplications = Object.values(applicationStats).reduce((acc, curr) => acc + curr, 0);
  
  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-center mb-2">Application Status</h3>
      {totalApplications > 0 ? (
        <div className="mx-auto" style={{ width: '100%', maxWidth: '300px' }}>
          <Pie data={data} options={options} />
        </div>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded">
          <p className="text-gray-500">No applications yet. Add your first job application to see stats.</p>
        </div>
      )}
    </div>
  );
};

export default StatsChart;
