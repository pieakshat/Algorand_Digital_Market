import { motion } from 'framer-motion'
import { FC, useState } from 'react'
// import { WalletContext } from '../context/walletContext'

interface FundingFormProps {
  onFund: (amount: number) => void
}

const FundingForm: FC<FundingFormProps> = ({ onFund }) => {
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  // const { initiateTransaction } = useContext(WalletContext)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    // await initiateTransaction(amount)
    setAmount('')
    setMessage('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white text-gray-800 p-6 rounded-lg shadow-xl mb-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-green-800">Provide Funding</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block mb-2 text-green-700">
            Amount (USD)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-2 text-green-700">
            Message (optional)
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
          Submit Funding
        </button>
      </form>
    </motion.div>
  )
}

export default FundingForm
