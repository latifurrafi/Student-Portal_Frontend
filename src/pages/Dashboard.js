import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [chartData, setChartData] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Initialize chart data
  useEffect(() => {
    setChartData({
      labels: ['Spring, 2023', 'Fall, 2023', 'Spring, 2024', 'Fall, 2024', 'Spring, 2025'],
      datasets: [
        {
          label: 'SGPA',
          data: [2.73, 3.10, 3.02, 2.48, 2.59],
          backgroundColor: [
            '#4ade80', // green-400
            '#67e8f9', // cyan-300
            '#c084fc', // purple-400
            '#84cc16', // lime-500
            '#4ade80'  // green-400
          ],
          borderRadius: 4,
          maxBarThickness: 60,
        },
      ],
    });
  }, []);

  const financialData = [
    { 
      title: 'Total Payable', 
      amount: '603,900.00', 
      color: 'from-blue-600 to-blue-700',
      icon: 'fas fa-money-bill-wave',
      trend: '+2.5%',
      trendColor: 'text-green-400'
    },
    { 
      title: 'Total Paid', 
      amount: '558,400.00', 
      color: 'from-green-600 to-green-700',
      icon: 'fas fa-check-circle',
      trend: '+5.2%',
      trendColor: 'text-green-400'
    },
    { 
      title: 'Total Due', 
      amount: '45,500.00', 
      color: 'from-red-600 to-red-700',
      icon: 'fas fa-exclamation-triangle',
      trend: '-1.8%',
      trendColor: 'text-red-400'
    },
    { 
      title: 'Total Other', 
      amount: '9,870.00', 
      color: 'from-purple-600 to-purple-700',
      icon: 'fas fa-calculator',
      trend: '+0.5%',
      trendColor: 'text-green-400'
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `SGPA: ${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 4.0,
        ticks: {
          stepSize: 0.5,
          callback: function(value) {
            return value.toFixed(1);
          },
        },
        grid: {
          color: '#f3f4f6',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  const handleCardClick = (index) => {
    setSelectedCard(selectedCard === index ? null : index);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Page Title */}
      <div className="mb-6 animate-slideInDown">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Student Portal</p>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {financialData.map((item, index) => (
          <div 
            key={index} 
            className={`bg-gradient-to-r ${item.color} rounded-lg p-6 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
              selectedCard === index ? 'ring-4 ring-white ring-opacity-50' : ''
            } animate-slideInUp`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => handleCardClick(index)}
          >
            <div className="flex items-center justify-between mb-2">
              <i className={`${item.icon} text-2xl opacity-90`}></i>
              <span className={`text-xs font-medium ${item.trendColor}`}>
                {item.trend}
              </span>
            </div>
            <h3 className="text-sm font-medium opacity-90 mb-2">{item.title}</h3>
            <p className="text-2xl font-bold">{item.amount}</p>
          </div>
        ))}
      </div>

      {/* Semester Wise Result */}
      <div className="bg-white rounded-lg shadow-sm p-6 animate-slideInUp" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Semester Wise Result</h2>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
              Export
            </button>
            <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
              Share
            </button>
          </div>
        </div>
        
        {/* Chart Container */}
        <div className="mb-4">
          <div className="flex items-center mb-4">
            <i className="fas fa-chart-bar text-blue-500 mr-2 animate-pulse"></i>
            <h3 className="text-base font-medium text-blue-600">Semester-wise SGPA Performance</h3>
            <div className="ml-4 flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded mr-2 animate-pulse"></div>
              <span className="text-sm text-gray-600">SGPA</span>
            </div>
          </div>
          <div className="h-80 relative">
            {chartData ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 animate-slideInUp" style={{ animationDelay: '500ms' }}>
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-graduation-cap text-blue-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current CGPA</p>
              <p className="text-lg font-semibold text-gray-900">3.15</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-book text-green-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Credits Completed</p>
              <p className="text-lg font-semibold text-gray-900">75/140</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <i className="fas fa-calendar text-purple-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Semester</p>
              <p className="text-lg font-semibold text-gray-900">5th</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 