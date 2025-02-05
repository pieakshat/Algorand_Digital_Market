import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom' // Import useLocation
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface PlantData {
  plantName: string
  plasticType: string
  cityName: string
  stateName: string
  countryName: string
  recyclingCapacity: number
  expectedRecyclingCapacity: number
  requiredFunding: number
  fundingReceived: number
}

interface ChartData {
  name: string
  value: number
}

interface AllocationData {
  name: string
  amount: number
}

interface PieLabelRenderProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
  name: string
  value: number
}

const Home: React.FC = () => {
  const location = useLocation()
  const [plantData, setPlantData] = useState<PlantData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const plantId = new URLSearchParams(location.search).get('plantId')

  const fundingData: ChartData[] = [
    { name: 'Received', value: 75000 },
    { name: 'Required', value: 25000 },
  ]

  const poolData: ChartData[] = [
    { name: 'Reserved', value: 60000 },
    { name: 'Available', value: 40000 },
  ]

  const allocationData: AllocationData[] = [
    { name: 'Previous', amount: 50000 },
    { name: 'Current', amount: 75000 },
    { name: 'Next', amount: 100000 },
  ]

  const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const { name, percent } = props
    return `${name} ${(percent * 100).toFixed(0)}%`
  }

  useEffect(() => {
    const fetchPlantData = async (): Promise<void> => {
      if (!plantId) {
        setError('No plantId provided in the query parameters.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`http://localhost:5000/plants/${plantId}`)
        if (!response.ok) {
          throw new Error(`Error fetching plant data: ${response.statusText}`)
        }
        const data: PlantData = await response.json()
        setPlantData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPlantData()
  }, [plantId])

  return (
    <div className="grid gap-6 md:grid-cols-2 p-6">
      {/* Plant Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Plant Information</h2>
        {loading ? (
          <p>Loading plant information...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : plantData ? (
          <div>
            <p>
              <strong>Plant Name:</strong> {plantData.plantName}
            </p>
            <p>
              <strong>Plastic Type:</strong> {plantData.plasticType}
            </p>
            <p>
              <strong>City:</strong> {plantData.cityName}
            </p>
            <p>
              <strong>State:</strong> {plantData.stateName}
            </p>
            <p>
              <strong>Country:</strong> {plantData.countryName}
            </p>
            <p>
              <strong>Recycling Capacity:</strong> {plantData.recyclingCapacity} tons/year
            </p>
            <p>
              <strong>Expected Recycling Capacity:</strong> {plantData.expectedRecyclingCapacity} tons/year
            </p>
            <p>
              <strong>Funding Required:</strong> {plantData.requiredFunding} Cr
            </p>
            <p>
              <strong>Funding Received:</strong> {plantData.fundingReceived} Cr
            </p>
          </div>
        ) : (
          <p>No plant data available.</p>
        )}
      </div>

      {/* Funding Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Funding Status</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={fundingData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={renderCustomLabel}
              >
                {fundingData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pool Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Pool Status</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={poolData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={renderCustomLabel}
              >
                {poolData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Allocation Periods */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Allocation Periods</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={allocationData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Home
