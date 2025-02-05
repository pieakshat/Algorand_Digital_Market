'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaHandHoldingUsd, FaRecycle } from 'react-icons/fa'
import { RiCommunityFill } from 'react-icons/ri'
import { SiHiveBlockchain } from 'react-icons/si'
// import ConnectWalletButton from './ConnectWalletButton'
import { useCallback } from 'react'
import background from '../assets/homePage/bg.jpg'
import join from '../assets/homePage/team.png'

export const useNavigation = () => {
  const navigateTo = useCallback((path: string) => {
    window.location.href = path
  }, [])

  return { navigateTo }
}

const HomePage = () => {
  const { navigateTo } = useNavigation()
  const [realTimeData, setRealTimeData] = useState({
    plasticRecycled: 0,
    fundsRaised: 0,
    communitiesImpacted: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData({
        plasticRecycled: Math.floor(Math.random() * 1000) + 500,
        fundsRaised: Math.floor(Math.random() * 100000) + 10000,
        communitiesImpacted: Math.floor(Math.random() * 50) + 5,
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className=" text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden h-screen">
        {/* <video
          autoPlay
          muted
          loop
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src= {background} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <img src={background} className="absolute top-0 left-0 w-full h-full object-cover" />

        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4"
          >
            Revolutionizing Plastic Recycling with Blockchain
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-xl sm:text-2xl md:text-3xl mb-8"
          >
            Fund sustainable initiatives, earn Soulbound Tokens, create impact.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            {/* <ConnectWalletButton /> */}
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
              onClick={() => navigateTo('/join')}
            >
              Join
              <img src={join} alt="join" className="w-6 h-6 ml-2 inline" />
            </button>
            {/* Add about us button */}
            <button className="border-solid border-2 border-sky-500 px-6 py-3 bg-transparent text-white rounded-lg shadow-md hover:bg-sky-500 hover:text-black transition duration-300 ease-in-out transform hover:-translate-y-1">
              About us
            </button>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white text-gray-800">
        <h2 className="text-3xl font-semibold text-center text-green-800 mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <FaHandHoldingUsd className="text-5xl text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Contribute Funds</h3>
            <p>Support plastic recycling initiatives using cryptocurrency.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <SiHiveBlockchain className="text-5xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Blockchain Transparency</h3>
            <p>Track your contributions and project progress on the blockchain.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md text-center">
            <FaRecycle className="text-5xl text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Earn SBTs</h3>
            <p>Receive Soulbound Tokens as proof of your environmental impact.</p>
          </div>
        </div>
      </section>

      {/* Real-time Impact Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-900 to-green-900">
        <h2 className="text-3xl font-semibold text-center text-white mb-12">Real-time Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-md text-center">
            <FaRecycle className="text-5xl text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-green-800">Plastic Recycled</h3>
            <p className="mt-4 text-3xl font-bold text-gray-800">{realTimeData.plasticRecycled} kg</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-md text-center">
            <FaHandHoldingUsd className="text-5xl text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-green-800">Funds Raised</h3>
            <p className="mt-4 text-3xl font-bold text-gray-800">${realTimeData.fundsRaised}</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white p-6 rounded-lg shadow-md text-center">
            <RiCommunityFill className="text-5xl text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-green-800">Communities Impacted</h3>
            <p className="mt-4 text-3xl font-bold text-gray-800">{realTimeData.communitiesImpacted}</p>
          </motion.div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4">
          <p className="text-lg">&copy; 2024 EcoFund. All Rights Reserved.</p>
          <p className="text-sm mt-2">Empowering sustainable recycling through blockchain technology.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="hover:text-green-400 transition duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-green-400 transition duration-300">
              Terms of Service
            </a>
            <a href="#" className="hover:text-green-400 transition duration-300">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
