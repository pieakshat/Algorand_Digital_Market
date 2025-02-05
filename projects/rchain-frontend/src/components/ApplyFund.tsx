import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface PlasticInput {
  PET: number
  HDPE: number
  PP: number
  PVC: number
  LDPE: number
  PS: number
  'Other Plastics': number
}

interface EstimationResponse {
  allocations: number[]
  categories: string[]
  costs_1: number[]
  estimateFunding: number
  expansion_budget: number
  operational_budget: number
  plastics: string[]
  plastics_1: string[]
  profit_per_month: number
  recycling_allocation: Record<string, number>
  recycling_budget: number
  scores: number[]
  total_recycle_cost: number
  total_recycling_cost: number
  total_selling_cost: number
}

const ApplyFund: React.FC = () => {
  const [plasticInputs, setPlasticInputs] = useState<PlasticInput>({
    PET: 0,
    HDPE: 0,
    PP: 0,
    PVC: 0,
    LDPE: 0,
    PS: 0,
    'Other Plastics': 0,
  })

  const [estimationResult, setEstimationResult] = useState<EstimationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [plantData, setPlantData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [areaType, setAreaType] = useState<string | null>(null)
  const [requestedFunds, setRequestedFunds] = useState<any>(0)
  const navigate = useNavigate()

  const plasticTypes = Object.keys(plasticInputs) as Array<keyof PlasticInput>
  const defaultPrices = {
    PET: 25000,
    HDPE: 30000,
    PP: 33000,
    PVC: 40000,
    LDPE: 40000,
    PS: 60000,
    'Other Plastics': 90000,
  }

  const plantId = new URLSearchParams(window.location.search).get('plantId')

  // Fetch plant data based on `plantId`
  const fetchPlantData = async () => {
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
      const data = await response.json()
      console.log(data)
      fetchAreaType(data.cityName || 'Pune').then((value) => setAreaType(value))

      setPlantData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Fetch area type dynamically
  const fetchAreaType = async (location: string): Promise<string> => {
    try {
      console.log()
      const response = await fetch('http://localhost:5000/area-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: location }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const { loc, areaType } = await response.json()
      console.log(areaType)
      return areaType // "developed", "developing", or "underdeveloped"
    } catch (error) {
      console.error('Error determining area type:', error)
      return 'unknown'
    }
  }

  useEffect(() => {
    const plantId = new URLSearchParams(window.location.search).get('plantId')
    if (plantId) {
      fetchPlantData()
      console.log(plantData)
    }
  }, [])

  const handleInputChange = (type: keyof PlasticInput, value: number) => {
    setPlasticInputs((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Ensure this returns a string like "Developed"

    const requestData = {
      types_of_plastics: plasticInputs, // Ensure this is an object like { PET: 600, "Other Plastics": 600 }
      location: areaType?.slice(0, -1), // Ensure this is a valid string
      requestedFunds: requestedFunds, // Ensure this is a number like 52240000
    }

    console.log(requestData)

    try {
      const response = await fetch('http://127.0.0.1:5500/get_estimation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch estimation')
      }

      const data: EstimationResponse = await response.json()
      setEstimationResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
    }
  }

  const handleApplyFunds = () => {
    if (estimationResult) {
      navigate(`/apply-fund?estimatedFunding=${estimationResult.estimateFunding}`)
    }
  }

  // Graph Data Preparation
  const profitVsCostData = [
    {
      name: 'Financial Metrics',
      'Profit Per Month': estimationResult?.profit_per_month || 0,
      'Total Recycling Cost': estimationResult?.total_recycling_cost || 0,
      'Total Selling Cost': estimationResult?.total_selling_cost || 0,
    },
  ]

  const recyclabilityScoreData = estimationResult
    ? estimationResult.plastics.map((plastic, index) => ({
        name: plastic,
        score: estimationResult.scores[index],
      }))
    : []

  const recyclingCostData = estimationResult
    ? estimationResult.plastics_1.map((plastic, index) => ({
        name: plastic,
        cost: estimationResult.costs_1[index],
      }))
    : []

  const fundAllocationData = estimationResult
    ? estimationResult.categories.map((category, index) => ({
        name: category,
        allocation: estimationResult.allocations[index],
      }))
    : []

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Plastic Recycling Estimation</h1>

      {plantData && (
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <h2 className="text-lg font-semibold">Plant Details</h2>
          <p>
            <strong>Plant Name:</strong> {plantData.plantName}
          </p>
          <p>
            <strong>Location:</strong> {plantData.cityName || 'Pune'}
          </p>
        </div>
      )}

      {areaType && (
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <h2 className="text-lg font-semibold">Area Type</h2>
          <p>{areaType}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {plasticTypes.map((type) => (
          <div key={type} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">{type} Quantity (kg)</label>
            <input
              type="number"
              value={plasticInputs[type]}
              onChange={(e) => handleInputChange(type, Number(e.target.value))}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}

        <label className="block text-gray-700 text-sm font-bold mb-2">Required Funds</label>
        <input
          type="number"
          onChange={(e) => setRequestedFunds(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 mb-5 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Get Estimation
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {estimationResult && (
        <div>
          <div className="bg-white shadow-md rounded p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Estimation Results</h2>
            <p className="text-lg">
              <strong>Estimated Funding:</strong> ${estimationResult.estimateFunding.toLocaleString()}
            </p>
            <button onClick={handleApplyFunds} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Apply for Funds
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Financial Metrics */}
            <div className="bg-white shadow-md rounded p-4">
              <h3 className="text-lg font-semibold mb-4">Financial Metrics</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitVsCostData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Profit Per Month" fill="#10B981" />
                  <Bar dataKey="Total Recycling Cost" fill="#EF4444" />
                  <Bar dataKey="Total Selling Cost" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recyclability Scores */}
            <div className="bg-white shadow-md rounded p-4">
              <h3 className="text-lg font-semibold mb-4">Plastic Recyclability Scores</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={recyclabilityScoreData}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recycling Costs */}
            <div className="bg-white shadow-md rounded p-4">
              <h3 className="text-lg font-semibold mb-4">Recycling Costs</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart layout="vertical" data={recyclingCostData}>
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Bar dataKey="cost" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Fund Allocations */}
            <div className="bg-white shadow-md rounded p-4">
              <h3 className="text-lg font-semibold mb-4">Fund Allocations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fundAllocationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="allocation" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplyFund
