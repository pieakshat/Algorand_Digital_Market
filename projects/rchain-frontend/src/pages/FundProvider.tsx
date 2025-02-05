import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import signInImg from '../assets/login/signIn1.svg'

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBywFxQVA4_Zjxc4Bap04pOdfRb2kKkHqc',
  authDomain: 'ecofund-b684b.firebaseapp.com',
  projectId: 'ecofund-b684b',
  storageBucket: 'ecofund-b684b.firebasestorage.app',
  messagingSenderId: '143960597932',
  appId: '1:143960597932:web:74950669158ec42eb94609',
}

import { FC } from 'react'

interface FundProviderProps {
  // Add your component props here if any
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

const SignInPage: FC<FundProviderProps> = () => {
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('Google Sign-In successful:', user)
      // Navigate to a different page or handle signed-in user
      navigate('/FundProviderDashBoard')
    } catch (error) {
      console.error('Google Sign-In error:', error)
    }
  }

  return (
    <motion.div className="flex h-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      {/* Left Side: Sign-In Form */}
      <motion.div
        className="flex flex-col justify-center items-center w-1/2 bg-green-100 p-8"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-green-800 mb-4">Welcome Back</h1>
        <p className="text-lg text-green-700 mb-8">Sign in to continue</p>
        <form className="w-3/4">
          <div className="mb-6">
            <label htmlFor="email" className="block text-green-800 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-green-800 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border rounded focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition">
            Sign In
          </button>
        </form>
        <p className="mt-6 text-green-700">Or</p>
        <button
          onClick={handleGoogleSignIn}
          className="mt-4 flex items-center justify-center bg-white text-green-800 border border-green-600 py-2 px-4 rounded hover:bg-green-50 transition"
        >
          <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.283 10.356h-8.327v3.451h4.836c-.696 2.002-2.523 3.451-4.836 3.451-2.905 0-5.255-2.349-5.255-5.255s2.35-5.255 5.255-5.255c1.407 0 2.678.556 3.631 1.462l2.606-2.606C16.771 2.713 14.529 2 12.099 2 6.48 2 2 6.48 2 12s4.48 10 10 10c5.523 0 10-4.477 10-10 0-.438-.037-.87-.106-1.294z"
            />
          </svg>
          Sign in with Google
        </button>
      </motion.div>

      {/* Right Side: Vector Image */}
      <motion.div
        className="w-1/2 bg-green-200 flex items-center justify-center"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={signInImg} alt="Vector Illustration" className="w-3/4" />
      </motion.div>
    </motion.div>
  )
}

export default SignInPage
