import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUser, faCheck, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import BorrowedBooksService from '../services/BorrowedBooksService';
import SummaryService from '../services/SummaryService';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Dashboard = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(false);
      try {
        const borrowerData = await BorrowedBooksService.getRecentBorrowers();
        const summaryData = await SummaryService.getDashboardSummary();

        setBorrowers(borrowerData || []);
        setSummary(summaryData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setErrorMessage("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  if (errorMessage) return <p className="p-4 text-red-500">{errorMessage}</p>;

  const stats = summary ? [
    { label: 'Books', value: summary.totalBooks || 0, icon: faBook },
    { label: 'Borrowers', value: summary.totalBorrowers || 0, icon: faUser },
    { label: 'Borrowed Books', value: summary.borrowedBooksCount || 0, icon: faCheck },
    { label: 'Fines', value: `$${summary.unpaidFinesSum || 0}`, icon: faDollarSign },
  ] : [];

  const chartData = summary ? [
    { name: 'Available Books', value: summary.totalBooks - summary.borrowedBooksCount },
    { name: 'Borrowed Books', value: summary.borrowedBooksCount },
  ] : [];

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  const COLORS = ['#ff8904', '#6a7282']; // Modern color palette

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={handleLogout}>
          Log out
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow text-center hover:shadow-lg transition-shadow duration-300"
          >
            <div className="text-5xl mb-4 text-orange-500">
              <FontAwesomeIcon icon={item.icon} />
            </div>
            <h3 className="text-4xl font-semibold text-gray-700 mb-2">{item.value}</h3>
            <p className="text-2xl text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Borrowers and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow">
        {/* Recent Borrowers */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Borrowers</h3>
          <div className="overflow-auto flex-grow">
            <table className="w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Book</th>
                  <th className="py-2 px-4">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {borrowers.map((b, index) => (
                  <tr
                    key={index}
                    className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : ''} hover:bg-gray-100`}
                  >
                    <td className="py-2 px-4">{b.name}</td>
                    <td className="py-2 px-4">{b.book}</td>
                    <td className="py-2 px-4">{b.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-center">
          <h3 className="text-left text-lg font-semibold text-gray-700 mb-4">Books Overview</h3>
          <div className="flex-grow w-full">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={150}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
