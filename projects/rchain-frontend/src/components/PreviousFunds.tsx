import { motion } from 'framer-motion'

const PreviousFunds = () => {
  // Mock data for previous transactions
  const transactions = [
    { id: 1, date: '2023-05-01', amount: 500, status: 'Completed' },
    { id: 2, date: '2023-04-15', amount: 1000, status: 'Completed' },
    { id: 3, date: '2023-03-30', amount: 250, status: 'Completed' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-white text-gray-800 p-6 rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold mb-4 text-green-800">Previous Funds</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-4 border-b text-green-800">Date</th>
              <th className="py-2 px-4 border-b text-green-800">Amount (USD)</th>
              <th className="py-2 px-4 border-b text-green-800">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-green-50">
                <td className="py-2 px-4 border-b">{tx.date}</td>
                <td className="py-2 px-4 border-b">${tx.amount}</td>
                <td className="py-2 px-4 border-b">
                  <span className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-sm">{tx.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default PreviousFunds
