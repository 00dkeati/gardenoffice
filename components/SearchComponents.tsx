import Link from 'next/link'
import { Search, MapPin, Star, Phone, Mail, Globe, CheckCircle } from 'lucide-react'

interface CompanyCardProps {
  company: {
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
    images: string[]
  }
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Company Image */}
        <div className="md:w-48 h-32 bg-secondary-100 rounded-lg flex items-center justify-center">
          <Globe className="w-12 h-12 text-secondary-400" />
        </div>
        
        {/* Company Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-1">
                {company.name}
              </h3>
              {company.verified && (
                <div className="flex items-center text-sm text-green-600 mb-2">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Verified Company
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center mb-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-semibold">{company.rating}</span>
                <span className="ml-1 text-secondary-600">({company.reviewCount})</span>
              </div>
              <div className="text-sm text-secondary-600">
                {company.city}, {company.county}
              </div>
            </div>
          </div>
          
          <p className="text-secondary-600 mb-4">{company.description}</p>
          
          {/* Services */}
          <div className="flex flex-wrap gap-2 mb-4">
            {company.services.map((service) => (
              <span
                key={service}
                className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
              >
                {service.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-sm text-secondary-600">
            {company.phone && (
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                {company.phone}
              </div>
            )}
            {company.email && (
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {company.email}
              </div>
            )}
            {company.website && (
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600">
                  Visit Website
                </a>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Link
              href={`/companies/${company.slug}`}
              className="btn-primary"
            >
              View Details
            </Link>
            <button className="btn-secondary">
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void
  currentFilters: any
}

export function SearchFilters({ onFilterChange, currentFilters }: SearchFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFilterChange({
      ...currentFilters,
      [key]: value
    })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Filter Results</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Service Type
          </label>
          <select 
            className="w-full input-field"
            value={currentFilters.service || ''}
            onChange={(e) => handleFilterChange('service', e.target.value)}
          >
            <option value="">All Services</option>
            <option value="garden-office">Garden Office</option>
            <option value="garden-office-pod">Garden Office Pod</option>
            <option value="garden-office-shed">Garden Office Shed</option>
            <option value="insulated-garden-office">Insulated Garden Office</option>
            <option value="bespoke-garden-office">Bespoke Garden Office</option>
            <option value="small-garden-office">Small Garden Office</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Location
          </label>
          <select 
            className="w-full input-field"
            value={currentFilters.location || ''}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="london">London</option>
            <option value="manchester">Manchester</option>
            <option value="birmingham">Birmingham</option>
            <option value="leeds">Leeds</option>
            <option value="glasgow">Glasgow</option>
            <option value="edinburgh">Edinburgh</option>
            <option value="bristol">Bristol</option>
            <option value="sheffield">Sheffield</option>
            <option value="liverpool">Liverpool</option>
            <option value="cardiff">Cardiff</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Minimum Rating
          </label>
          <select 
            className="w-full input-field"
            value={currentFilters.rating || ''}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Company Status
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2"
                checked={currentFilters.verified || false}
                onChange={(e) => handleFilterChange('verified', e.target.checked)}
              />
              <span className="text-sm text-secondary-700">Verified Only</span>
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2"
                checked={currentFilters.featured || false}
                onChange={(e) => handleFilterChange('featured', e.target.checked)}
              />
              <span className="text-sm text-secondary-700">Featured Only</span>
            </label>
          </div>
        </div>
        <button 
          className="w-full btn-primary"
          onClick={() => onFilterChange({})}
        >
          Clear Filters
        </button>
      </div>
    </div>
  )
}

interface SearchBarProps {
  onSearch: (query: string, location: string) => void
  initialQuery?: string
  initialLocation?: string
}

export function SearchBar({ onSearch, initialQuery = '', initialLocation = '' }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('query') as string
    const location = formData.get('location') as string
    onSearch(query, location)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <input
            type="text"
            name="query"
            placeholder="Search for garden office builders..."
            defaultValue={initialQuery}
            className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="sm:w-48 relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
          <select 
            name="location"
            defaultValue={initialLocation}
            className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Locations</option>
            <option value="london">London</option>
            <option value="manchester">Manchester</option>
            <option value="birmingham">Birmingham</option>
            <option value="leeds">Leeds</option>
            <option value="glasgow">Glasgow</option>
            <option value="edinburgh">Edinburgh</option>
            <option value="bristol">Bristol</option>
            <option value="sheffield">Sheffield</option>
            <option value="liverpool">Liverpool</option>
            <option value="cardiff">Cardiff</option>
          </select>
        </div>
        <button type="submit" className="btn-primary px-8 py-3">
          Search
        </button>
      </div>
    </form>
  )
}



