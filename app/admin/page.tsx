'use client'

import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, Search, Filter } from 'lucide-react'

interface Company {
  id: string
  name: string
  slug: string
  description: string
  website?: string
  phone?: string
  email?: string
  city: string
  county: string
  services: string[]
  rating: number
  reviewCount: number
  verified: boolean
  featured: boolean
  active: boolean
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Garden Office Solutions Ltd',
    slug: 'garden-office-solutions-ltd',
    description: 'Specialists in bespoke garden offices and insulated garden rooms across the UK.',
    website: 'https://gardenofficesolutions.co.uk',
    phone: '0800 123 4567',
    email: 'info@gardenofficesolutions.co.uk',
    city: 'London',
    county: 'Greater London',
    services: ['garden-office', 'garden-office-pod', 'insulated-garden-office'],
    rating: 4.8,
    reviewCount: 127,
    verified: true,
    featured: true,
    active: true
  },
  {
    id: '2',
    name: 'Premier Garden Rooms',
    slug: 'premier-garden-rooms',
    description: 'Leading provider of garden offices, pods, and bespoke garden buildings.',
    website: 'https://premiergardenrooms.co.uk',
    phone: '0800 987 6543',
    email: 'hello@premiergardenrooms.co.uk',
    city: 'Manchester',
    county: 'Greater Manchester',
    services: ['garden-office', 'garden-office-room', 'bespoke-garden-office'],
    rating: 4.9,
    reviewCount: 89,
    verified: true,
    featured: true,
    active: true
  },
  {
    id: '3',
    name: 'Eco Garden Buildings',
    slug: 'eco-garden-buildings',
    description: 'Sustainable garden offices and eco-friendly garden rooms with excellent insulation.',
    website: 'https://ecogardenbuildings.co.uk',
    phone: '0800 555 7890',
    email: 'contact@ecogardenbuildings.co.uk',
    city: 'Birmingham',
    county: 'West Midlands',
    services: ['garden-office', 'insulated-garden-office', 'garden-office-buildings'],
    rating: 4.7,
    reviewCount: 156,
    verified: true,
    featured: false,
    active: true
  }
]

export default function AdminPanel() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.county.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'verified' && company.verified) ||
                         (filterStatus === 'featured' && company.featured) ||
                         (filterStatus === 'active' && company.active)

    return matchesSearch && matchesFilter
  })

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      setCompanies(companies.filter(company => company.id !== id))
    }
  }

  const handleToggleStatus = (id: string, field: 'verified' | 'featured' | 'active') => {
    setCompanies(companies.map(company => 
      company.id === id 
        ? { ...company, [field]: !company[field] }
        : company
    ))
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary-600">Admin Panel</h1>
            <div className="flex items-center space-x-4">
              <span className="text-secondary-600">Welcome, Admin</span>
              <button className="btn-secondary">Logout</button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-2xl font-bold text-primary-600">{companies.length}</div>
            <div className="text-secondary-600">Total Companies</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-green-600">
              {companies.filter(c => c.verified).length}
            </div>
            <div className="text-secondary-600">Verified</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-yellow-600">
              {companies.filter(c => c.featured).length}
            </div>
            <div className="text-secondary-600">Featured</div>
          </div>
          <div className="card">
            <div className="text-2xl font-bold text-blue-600">
              {companies.filter(c => c.active).length}
            </div>
            <div className="text-secondary-600">Active</div>
          </div>
        </div>

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-secondary-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Companies</option>
                  <option value="verified">Verified Only</option>
                  <option value="featured">Featured Only</option>
                  <option value="active">Active Only</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Company
            </button>
          </div>
        </div>

        {/* Companies Table */}
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900">Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900">Location</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-secondary-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-secondary-900">{company.name}</div>
                        <div className="text-sm text-secondary-600">{company.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-secondary-700">
                        {company.city}, {company.county}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span className="font-medium text-secondary-900">{company.rating}</span>
                        <span className="text-sm text-secondary-600 ml-1">({company.reviewCount})</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          company.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {company.verified ? 'Verified' : 'Unverified'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          company.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {company.featured ? 'Featured' : 'Regular'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          company.active ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {company.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1 text-primary-600 hover:text-primary-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-secondary-600 hover:text-secondary-700">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(company.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Company Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Add New Company</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Company Name
                    </label>
                    <input type="text" className="w-full input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Slug
                    </label>
                    <input type="text" className="w-full input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Description
                  </label>
                  <textarea className="w-full input-field" rows={3}></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      City
                    </label>
                    <input type="text" className="w-full input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      County
                    </label>
                    <input type="text" className="w-full input-field" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Add Company
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



