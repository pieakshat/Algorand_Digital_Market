import { useWallet } from '@txnlab/use-wallet'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaLeaf } from 'react-icons/fa'
import CompanyList from '../components/CompanyList'
import ConnectWallet from '../components/ConnectWallet'
import FundingForm from '../components/FundingForm'
import PreviousFunds from '../components/PreviousFunds'
import SBTCards from '../components/SBTCards'
import TrustBuildingSection from '../components/TrustBuildingSection'

const FundProviderDashboard = () => {
  const { activeAddress, isLoading: walletLoading } = useWallet()
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [totalFunded, setTotalFunded] = useState(0)
  const [showTxnPopup, setShowTxnPopup] = useState(false)
  const [txnHash, setTxnHash] = useState('')

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const handleFund = (amount) => {
    setTotalFunded((prev) => prev + amount)
  }

  const closePopup = () => {
    setShowTxnPopup(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-green-700 text-white">
      <header className="bg-green-800 shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaLeaf className="text-3xl text-green-400" />
            <h1 className="text-3xl font-bold">EcoFund Dashboard</h1>
          </div>
          <button onClick={toggleWalletModal} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors">
            {activeAddress ? `Connected: ${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}` : 'Connect Wallet'}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {walletLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="flex flex-col items-center">
                <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-400"></div>
                <p className="text-xl mt-4">Connecting to wallet...</p>
              </div>
            </div>
          ) : activeAddress ? (
            <>
              <FundingForm onFund={handleFund} />
              <TrustBuildingSection />
              <SBTCards />
              <PreviousFunds />
              <br />
              <CompanyList />
            </>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-4xl font-bold mb-4">Welcome to EcoFund</h2>
              <p className="text-xl mb-8">Connect your wallet to start making a difference!</p>
              <button
                onClick={toggleWalletModal}
                className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg text-lg transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </motion.div>
      </main>

      <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />

      {showTxnPopup && txnHash && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-green-400">Transaction Successful</h2>
            <p className="mb-4 text-black">View on block explorer</p>
            <a
              href={`https://base-sepolia.blockscout.com/tx/${txnHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {txnHash}
            </a>
            <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg" onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default FundProviderDashboard
