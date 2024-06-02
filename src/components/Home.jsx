import React, { useEffect, useState } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import { datajson } from '../../data';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(datajson);
  }, []);

  const formatChartData = () => {
    const LineData = {};
    data.forEach((item) => {
      const time = new Date(item.timestamp).toLocaleTimeString();
      LineData[time] = (LineData[time] || 0) + 1;
    });
    return { LineData };
  };

  const { LineData } = formatChartData();

  const lineData = {
    labels: Object.keys(LineData),
    datasets: [
      {
        label: "Number of Alerts Over Time",
        data: Object.values(LineData),
        borderColor: '#FF0000',
        backgroundColor: 'rgba(66, 153, 225, 0.2)',
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 7,
        showLine: true,
        fill: true,
        cubicInterpolationMode: 'monotone'
      },
    ],
  };

  const uniqueSignatures = [...new Set(data.map(item => item.alert.signature))];
  const truncatedLabels = uniqueSignatures.map(label => {
    const maxLength = 14;
    return label.length > maxLength ? `${label.substring(0, maxLength)}...` : label;
  });

  const barData = {
    labels: truncatedLabels,
    datasets: [
      {
        label: 'Number of Alerts per Signature',
        data: uniqueSignatures.map(sig => data.filter(item => item.alert.signature === sig).length),
        backgroundColor: '#34A853'


      },
    ],
  };

  const uniqueCategories = [...new Set(data.map(item => item.alert.category))];
  const pieData = {
    labels: uniqueCategories,
    datasets: [
      {
        label: 'Alerts Categories',
        data: uniqueCategories.map(cat => data.filter(item => item.alert.category === cat).length),
        backgroundColor: ['#33ff57', '#f54254', '#3357ff', '#ff33a1', '#33a1ff'],

        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const uniqueSeverities = [...new Set(data.map(item => item.alert.severity))];
  const severityCounts = uniqueSeverities.map(severity => data.filter(item => item.alert.severity === severity).length);

  const doughnutData = {
    labels: uniqueSeverities.map(severity => `Severity ${severity}`),
    datasets: [
      {
        label: 'Number of Alerts per Severity',
        data: severityCounts,
        backgroundColor: ['#ff6f61', '#6a1b9a', '#ffeb3b', '#00bcd4', '#8bc34a', '#ff5722', '#3f51b5'],

        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: (ctx) => ctx.chart.data.datasets[0].label,
        color: 'white',
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
      },
    },
  };

  const chartOptionsWithoutScales = {
    ...chartOptions,
    scales: {},
  };
  

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="flex items-center mb-8">
        <h1 className="text-5xl py-4 text-blue-200 text-center"><strong>WI-Jungle Dashboard</strong></h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl" style={{ height: '500px' }}>
          <Line data={lineData} options={chartOptions} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl" style={{ height: '500px' }}>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl" style={{ height: '500px' }}>
          <Pie data={pieData} options={chartOptionsWithoutScales} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl" style={{ height: '500px' }}>
          <Doughnut data={doughnutData} options={chartOptionsWithoutScales} />
        </div>
      </div>
    </div>
  );
};


