import { useJsApiLoader } from '@react-google-maps/api'
import { useWallet } from '@txnlab/use-wallet'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import digilockerIcon from '../assets/recyclePlantReg/digilocker.png'
import register from '../assets/recyclePlantReg/register2.svg'
import walletIcon from '../assets/recyclePlantReg/wallet.png'

const RecyclePlant = () => {
  const navigate = useNavigate()
  const { activeAddress, providers, isReady } = useWallet()
  const [openWalletModal, setOpenWalletModal] = useState(false)

  // Form states
  const [location, setLocation] = useState('')
  const [plantName, setPlantName] = useState('')
  const [plasticType, setPlasticType] = useState('PET')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyValuation, setCompanyValuation] = useState('')
  const [recyclingCapacity, setRecyclingCapacity] = useState('')
  const [expectedRecyclingCapacity, setExpectedRecyclingCapacity] = useState('')
  const [plantArea, setPlantArea] = useState(0)
  const [cityName, setCityName] = useState('')
  const [stateName, setStateName] = useState('')
  const [countryName, setCountryName] = useState('')

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCliIRDkQyrfH8jXl7y0vf1U61duC9yA7w',
  })

  const handleLocationFetch = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)

            if (!response.ok) {
              throw new Error('Failed to fetch address')
            }

            const data = await response.json()
            const { address } = data

            const formattedAddress = `
              ${address.amenity || ''}, ${address.road || ''}, ${address.neighbourhood || ''}, 
              ${address.village || address.city || ''}, ${address.state_district || address.state || ''}, 
              ${address.country || ''} (${address.postcode || ''})
            `
              .replace(/\s+/g, ' ')
              .trim()

            setCityName(address.city)
            setStateName(address.state)
            setCountryName(address.country)

            let area =
              (parseFloat(data.boundingbox[1]) - parseFloat(data.boundingbox[0])) *
              (parseFloat(data.boundingbox[3]) - parseFloat(data.boundingbox[2])) *
              247.105
            setPlantArea(area)
            setLocation(formattedAddress)
          } catch (error) {
            console.error('Error fetching address:', error)
            setLocation('Unable to fetch address')
          }
        },
        (error) => {
          console.error('Error fetching location:', error)
          setLocation('Error fetching location')
        },
      )
    } else {
      console.error('Geolocation not supported by this browser.')
      setLocation('Geolocation not supported by this browser.')
    }
  }

  // Wallet Modal Component
  const WalletModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Connect Wallet</h2>
          <div className="space-y-4">
            {providers?.map((provider) => (
              <button
                key={provider.metadata.id}
                onClick={() => {
                  provider.connect()
                  onClose()
                }}
                className="w-full p-4 border rounded-lg hover:bg-gray-50 text-gray-800 flex items-center justify-between"
              >
                <span>{provider.metadata.name}</span>
                {provider.metadata.icon && <img src={provider.metadata.icon} alt={`${provider.metadata.name} icon`} className="w-8 h-8" />}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="mt-4 w-full p-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    )
  }

  const handleKYC = async () => {
    const data = {
      plantName,
      companyEmail,
      companyValuation,
      recyclingCapacity,
      expectedRecyclingCapacity,
      plantArea,
      cityName,
      stateName,
      countryName,
      walletAddress: activeAddress,
      requiredFunding: 0,
      fundingReceived: 0,
    }

    console.log('Plant Registration Data:', data)

    try {
      const response = await fetch('http://localhost:5000/register-plant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Success:', result.message)
        alert('Plant registered successfully!')
        navigate(`/PlantDashboard?plantId=${result.plantId}`)
      } else {
        console.error('Failed to register plant')
        alert('Failed to register plant.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while registering the plant.')
    }
  }

  return (
    <motion.div className="flex h-screen bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <motion.div
        className="flex flex-col justify-center items-center w-1/2 bg-green-100 p-8"
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl font-bold text-green-800 mb-4">Plastic Recycle Plant Registration</h1>
        <p className="text-lg text-green-700 mb-8">🍀 Onboard your 🏭 on our platform 🍀</p>
        <form className="w-3/4 space-y-4">
          <input
            type="text"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-green-300"
            placeholder="Plant Name"
          />
          <input
            type="email"
            value={companyEmail}
            onChange={(e) => setCompanyEmail(e.target.value)}
            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-green-300"
            placeholder="Company Email"
          />
          <input
            type="number"
            value={companyValuation}
            onChange={(e) => setCompanyValuation(e.target.value)}
            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-green-300"
            placeholder="Company Valuation (in Cr)"
          />
          <input
            type="number"
            value={recyclingCapacity}
            onChange={(e) => setRecyclingCapacity(e.target.value)}
            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-green-300"
            placeholder="Recycling Capacity (tons/year)"
          />
          <input
            type="number"
            value={expectedRecyclingCapacity}
            onChange={(e) => setExpectedRecyclingCapacity(e.target.value)}
            className="w-full p-3 border rounded-md shadow-sm focus:ring focus:ring-green-300"
            placeholder="Expected Capacity After Expansion (tons/year)"
          />
          <div className="flex">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border rounded-l-md shadow-sm focus:ring focus:ring-green-300"
              placeholder="Location"
            />
            <button type="button" onClick={handleLocationFetch} className="px-4 bg-green-600 text-white rounded-r-md">
              Fetch
            </button>
          </div>
          <div className="flex">
            <input
              type="text"
              value={activeAddress || ''}
              readOnly
              className="w-full p-3 border rounded-l-md shadow-sm focus:ring focus:ring-green-300"
              placeholder="Wallet Address"
            />
            <button
              type="button"
              onClick={() => setOpenWalletModal(true)}
              className="px-4 bg-green-600 text-white rounded-r-md"
              disabled={!isReady}
            >
              <img src={walletIcon} alt="Wallet" className="w-6" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleKYC}
            className="flex items-center justify-center bg-green-600 text-white p-2 w-56 rounded-md hover:bg-green-700 transition"
            disabled={!activeAddress}
          >
            <img src={digilockerIcon} alt="Digilocker" className="w-10 h-10" />
            Register with KYC
          </button>
        </form>
      </motion.div>
      <motion.div
        className="w-1/2 flex items-center justify-center bg-green-300"
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <img src={register} alt="Illustration" className="w-3/4" />
      </motion.div>

      <WalletModal isOpen={openWalletModal} onClose={() => setOpenWalletModal(false)} />
    </motion.div>
  )
}

export default RecyclePlant
