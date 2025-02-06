import React, { useState } from 'react';
// import WalletConnection from '../components/ConnectWalletButton';
import Home from '../components/Home';
import ApplyFund from '../components/ApplyFund';
import { FaLeaf } from 'react-icons/fa'
// import ReportProgress from '../components/ReportProgress'; // Uncomment when this component is available

const PlantDashboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [buttonStatus, setButtonStatus] = useState('Connect Wallet');



  const handleConnect = () => {
    setIsConnected(true);
    setButtonStatus('Wallet Connected');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'apply':
        return <ApplyFund />;
      case 'report':
        // return <ReportProgress />; // Uncomment when available
        return <div>Report Progress Component Placeholder</div>;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-600 text-white flex flex-col">
        <div className="p-6 flex items-center gap-4">
          <FaLeaf className="text-3xl" />
          <h2 className="text-xl font-bold">EcoPlant Dashboard</h2>
        </div>
        <div className="flex-1">
          <nav>
            <ul>
              <li
                className={`p-4 cursor-pointer ${activeTab === 'home' ? 'bg-green-700' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </li>
              <li
                className={`p-4 cursor-pointer ${activeTab === 'apply' ? 'bg-green-700' : ''}`}
                onClick={() => setActiveTab('apply')}
              >
                Apply for Funds
              </li>
              <li
                className={`p-4 cursor-pointer ${activeTab === 'report' ? 'bg-green-700' : ''}`}
                onClick={() => setActiveTab('report')}
              >
                Report Progress
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-md p-4">
          <button isConnected={isConnected} onClick={handleConnect} className='bg-green-500 hover:bg-green-700 p-4 rounded-xl' >{buttonStatus}</button>
        </header>
        <main className="p-6">
          {isConnected ? (
            renderContent()
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                Welcome to EcoPlant Dashboard
              </h2>
              <p className="text-gray-600 mb-8">
                Please connect your wallet to access the dashboard.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PlantDashboard;
