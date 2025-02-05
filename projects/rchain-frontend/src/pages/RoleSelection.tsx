import { FaIndustry } from 'react-icons/fa'
import { FcBusinessman } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'

const RoleSelection = () => {
  const navigate = useNavigate()

  const handleRoleSelection = (role: any) => {
    console.log(`Selected Role: ${role}`)
    if (role === 'Plastic Recycle Plant') navigate('/RecyclePlant')
    else if (role === 'Fund Provider') navigate('/FundProvider')
    else console.log('Invalid Role')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Choose Your Role</h1>
      <p className="text-lg text-green-700 mb-8">Select your role to proceed</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition hover:scale-105 hover:bg-green-400 hover:text-white cursor-pointer"
          onClick={() => handleRoleSelection('Plastic Recycle Plant')}
        >
          <div className="flex items-center justify-center w-16 h-16 bg-green-300 rounded-full mb-4">
            <FaIndustry className="w-8 h-8 text-green-800" />
          </div>

          <h2 className="text-xl font-semibold text-green-800 ">Plastic Recycle Plant</h2>
          <p className="text-green-600 mt-2">Join the movement to recycle plastic and contribute towards a sustainable future.</p>
        </div>

        <div
          className="p-6 bg-white shadow-lg rounded-lg transform transition hover:scale-105 hover:bg-green-400 cursor-pointer"
          onClick={() => handleRoleSelection('Fund Provider')}
        >
          <div className="flex items-center justify-center w-16 h-16 bg-green-300 rounded-full mb-4">
            <FcBusinessman className="w-12 h-12 text-green-800" />
          </div>
          <h2 className="text-xl font-semibold text-green-800">Fund Provider</h2>
          <p className="text-green-600 mt-2">Support initiatives that drive eco-friendly practices and create lasting impact.</p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
