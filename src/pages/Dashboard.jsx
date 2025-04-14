import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const data = [
    { name: 'Available', value: 50 },
    { name: 'Borrowed', value: 30 },
    { name: 'Reserved', value: 70 },
  ];

  const stats = [
    { label: 'Books', value: 150, icon: '📚' },
    { label: 'Borrowers', value: 120, icon: '🧑‍💼' },
    { label: 'Borrowed Books', value: 45, icon: '✅' },
    { label: 'Fines', value: '$320', icon: '💰' },
  ];

  const borrowers = [
    { name: 'John Doe', book: 'The Great Gatsby', due: '2023-05-10' },
    { name: 'Jane Smith', book: '1984', due: '2023-05-12' },
    { name: 'Michael Johnson', book: 'To Kill a Mockingbird', due: '2023-05-15' },
    { name: 'Emily Brown', book: 'Pride and Prejudice', due: '2023-05-18' },
    { name: 'Daniel Wilson', book: 'Moby Dick', due: '2023-05-20' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Log out
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow text-center">
            <div className="text-5xl mb-4">{item.icon}</div>
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
                  <tr key={index} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{b.name}</td>
                    <td className="py-2 px-4">{b.book}</td>
                    <td className="py-2 px-4">{b.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-xl shadow flex flex-col">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Books Overview</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#60A5FA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
