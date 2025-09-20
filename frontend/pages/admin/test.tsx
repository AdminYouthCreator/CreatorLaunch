import React from 'react';

const AdminTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-500">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-4">Admin Panel Test</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tailwind CSS Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-500 p-4 rounded text-white">Red Card</div>
            <div className="bg-green-500 p-4 rounded text-white">Green Card</div>
            <div className="bg-yellow-500 p-4 rounded text-white">Yellow Card</div>
          </div>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
