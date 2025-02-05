import React from 'react'
import { motion } from 'framer-motion'
import { FaShieldAlt, FaChartLine, FaLeaf } from 'react-icons/fa'

const TrustBuildingSection = () => {
  const features = [
    {
      icon: FaShieldAlt,
      title: 'Secure Blockchain',
      description: 'Your funds are protected by cutting-edge blockchain technology, ensuring transparency and security.',
    },
    {
      icon: FaChartLine,
      title: 'Real-time Impact',
      description: 'Watch your contributions make a difference with our live impact tracking system.',
    },
    {
      icon: FaLeaf,
      title: 'Eco-Certified Partners',
      description: 'We work exclusively with certified eco-friendly recycling facilities to maximize environmental impact.',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg shadow-xl p-8 mb-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-green-800 text-center">Why Choose EcoFund?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-green-50 p-6 rounded-lg shadow-md"
          >
            <feature.icon className="text-4xl text-green-600 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2 text-green-800 text-center">{feature.title}</h3>
            <p className="text-gray-600 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default TrustBuildingSection

