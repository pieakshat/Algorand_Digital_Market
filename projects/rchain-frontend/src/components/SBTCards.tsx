import React from 'react'
import { motion } from 'framer-motion'
import { FaMedal, FaGem, FaCrown } from 'react-icons/fa'

const SBTCards= () => {
  const cards = [
    {
      title: 'Bronze Contributor',
      range: '$200 - $1,000',
      color: 'from-amber-700 via-orange-300 to-yellow-500',
      icon: FaMedal,
      description: 'You\'re making a difference! Your contribution helps us recycle and repurpose plastic waste.',
    },
    {
      title: 'Silver Innovator',
      range: '$1,001 - $10,000',
      color: 'from-gray-400 via-slate-300 to-zinc-200',
      icon: FaGem,
      description: 'Your impact is growing! You\'re a true environmental champion, driving significant change.',
    },
    {
      title: 'Gold Visionary',
      range: '$10,001+',
      color: 'from-yellow-400 via-amber-300 to-orange-500',
      icon: FaCrown,
      description: 'Wow! Your contributions are transforming the recycling industry and our planet\'s future.',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Soulbound Tokens (SBTs)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, rotate: 2 }}
            className={`relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br ${card.color}`}
          >
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative px-6 py-8 flex flex-col items-center">
              <card.icon className="text-6xl mb-4 text-white" />
              <h3 className="font-bold text-2xl mb-2 text-white text-center">{card.title}</h3>
              <p className="text-white text-lg mb-4 font-semibold">{card.range}</p>
              <p className="text-white text-center text-sm">{card.description}</p>
              <motion.div
                className="absolute -bottom-16 -right-16 w-32 h-32 bg-white rounded-full opacity-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default SBTCards

