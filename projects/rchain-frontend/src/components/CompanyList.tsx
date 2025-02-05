import axios from 'axios'
import { useEffect, useState } from 'react'
import 'tailwindcss/tailwind.css'
import companyImage from '../assets/img.jpg'

interface Company {
  _id: string
  plantName: string
  cityName: string
  stateName: string
  countryName: string
  plasticType: string
  recyclingCapacity: number
  expectedRecyclingCapacity: number
  requiredFunding: number
  fundingReceived: number
}

const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    axios
      .get('http://localhost:5000/companies') // Replace with your actual API endpoint
      .then((response) => {
        setCompanies(response.data)
      })
      .catch((error) => {
        console.error('Error fetching companies:', error)
      })
  }, [])

  return (
    <div className="bg-green-50 text-green-900 p-10 text-center">
      <h1 className="text-4xl font-bold mb-10 text-green-700">Onboarded Recycling Plants</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {companies.map((company) => (
          <div
            key={company._id}
            className="bg-white border border-green-200 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300"
          >
            <img src={companyImage} alt="Recycling Plant" className="w-full h-48 object-cover" />
            <div className="p-6 text-left">
              <h2 className="text-2xl font-semibold">{company.plantName}</h2>
              <p className="mt-2">
                <strong>Location:</strong> {company.cityName}, {company.stateName}, {company.countryName}
              </p>
              <p className="mt-1">
                <strong>Plastic Type:</strong> {company.plasticType}
              </p>
              <p className="mt-1">
                <strong>Capacity:</strong> {company.recyclingCapacity} kg/day
              </p>
              <p className="mt-1">
                <strong>Target Capacity:</strong> {company.expectedRecyclingCapacity} kg/day
              </p>
              <p className="mt-1">
                <strong>Required Funding:</strong> ${company.requiredFunding}M
              </p>
              <p className="mt-1">
                <strong>Funding Received:</strong> ${company.fundingReceived}M
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompanyList
