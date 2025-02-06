import { motion } from 'framer-motion'
import { FC, useState } from 'react'
import { buyAndMint } from '../methods'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import * as algokit from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { RchainClient } from '../contracts/Rchain'
import { RchainFactory } from '../contracts/Rchain'


interface FundingFormProps {
  onFund: (amount: number) => void
}

const FundingForm: FC<FundingFormProps> = ({ onFund }) => {
  const [amount, setAmount] = useState<bigint>(BigInt(0))
  const [message, setMessage] = useState('')

  // Wallet connection state
  const { activeAccount, signer: TransactionSigner } = useWallet()
  const [appId, setAppId] = useState<bigint>(BigInt(733459037))
  const [usdtId, setUsdtId] = useState<bigint>(BigInt(0))
  const [appAddress, setAppAddress] = useState('PJTNNXQHBXMFOJBTUYHQOTEQBUT5MVBNU5GSOR6LLDZT3XH5UBUH23ZN44')

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = algokit.AlgorandClient.fromConfig({ algodConfig })

  if (TransactionSigner) {
    algorand.setDefaultSigner(TransactionSigner);
  }

  const rmclient = appId > 0n
    ? new RchainClient({
      appId,
      algorand,
      defaultSigner: TransactionSigner,
    })
    : null;

  const rcfactory = new RchainFactory({
    algorand: algorand,
    defaultSender: activeAccount?.address,
    defaultSigner: TransactionSigner,
  })

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log("Starting...");
    console.log("Amount before submitting:", amount); // Debugging

    try {
      if (!rmclient) {
        throw new Error("RchainClient is not initialized properly.");
      }

      if (!TransactionSigner) {
        throw new Error("no signerrr")
      }

      await buyAndMint(
        algorand,
        rmclient,
        TransactionSigner,  // Ensure correct signer is passed
        String(activeAccount?.address),
        appAddress,
        BigInt(amount)  // Ensure correct number format
      );


    } catch (err: any) {
      console.error('Error:', err?.message || err);
    }

    setAmount(BigInt(0));  // Reset amount
    setMessage('');
  };

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault()
  //   console.log("Starting...")
  //   console.log(algorand)
  //   console.log(rmclient)
  //   console.log(activeAddress)
  //   console.log(appAddress)
  //   console.log(usdtId)
  //   console.log(amount)

  //   try {
  //     if (rmclient) {
  //       await buyAndMint(
  //         algorand,
  //         rmclient,
  //         String(activeAddress),
  //         appAddress,
  //         usdtId,
  //         amount
  //       )
  //     } else {
  //       console.error("RchainClient is not initialized properly.")
  //     }
  //   } catch (err: any) {
  //     console.error('Error:', err?.message || err)
  //   }

  //   setAmount(BigInt(0))
  //   setMessage('')
  // }

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
            value={amount.toString()}
            onChange={(e) => setAmount(BigInt(e.target.value || '0'))}
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
