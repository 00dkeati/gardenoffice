import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Star, Phone, Mail, Globe, CheckCircle } from 'lucide-react'

// This would normally come from your database
const mockCompanies = [
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
    images: ['/images/company1-1.jpg', '/images/company1-2.jpg']
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
    images: ['/images/company2-1.jpg', '/images/company2-2.jpg']
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
    images: ['/images/company3-1.jpg', '/images/company3-2.jpg']
  }
]

interface SearchPageProps {
  searchParams: {
    type?: string
    location?: string
  }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const type = searchParams.type || 'garden office'
  const location = searchParams.location || 'UK'
  
  const title = `${type.charAt(0).toUpperCase() + type.slice(1)} Builders in ${location} | Garden Office Directory`
  const description = `Find the best ${type} builders in ${location}. Compare prices, read reviews, and connect with local specialists for your garden office project.`
  
  return {
    title,
    description,
    keywords: `${type}, ${type} builders, ${type} ${location}, garden office ${location}, ${type} companies`,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_GB',
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const type = searchParams.type || 'garden office'
  const location = searchParams.location || 'UK'
  
  const displayType = type.replace(/-/g, ' ')
  const displayLocation = location.replace(/-/g, ' ')

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Garden Office Directory
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/companies" className="text-secondary-600 hover:text-primary-600">
                All Companies
              </Link>
              <Link href="/locations" className="text-secondary-600 hover:text-primary-600">
                Locations
              </Link>
              <Link href="/services" className="text-secondary-600 hover:text-primary-600">
                Services
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-secondary-50 py-4">
        <div className="container">
          <nav className="text-sm">
            <Link href="/" className="text-primary-600 hover:text-primary-700">
              Home
            </Link>
            <span className="mx-2 text-secondary-400">/</span>
            <span className="text-secondary-600">
              {displayType.charAt(0).toUpperCase() + displayType.slice(1)} Builders
            </span>
            {location !== 'UK' && (
              <>
                <span className="mx-2 text-secondary-400">/</span>
                <span className="text-secondary-600">{displayLocation}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
              {displayType.charAt(0).toUpperCase() + displayType.slice(1)} Builders in {displayLocation}
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Find the best local {displayType} builders and specialists in {displayLocation}. 
              Compare prices, read reviews, and get quotes from verified companies.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">{mockCompanies.length}+</div>
                <div className="text-secondary-600">Verified Builders</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">500+</div>
                <div className="text-secondary-600">Completed Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">4.8</div>
                <div className="text-secondary-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Companies List */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {mockCompanies.map((company) => (
                  <div key={company.id} className="card hover:shadow-md transition-shadow duration-200">
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
                ))}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Filter Box */}
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Filter Results</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Service Type
                    </label>
                    <select className="w-full input-field">
                      <option value="">All Services</option>
                      <option value="garden-office">Garden Office</option>
                      <option value="garden-office-pod">Garden Office Pod</option>
                      <option value="garden-office-shed">Garden Office Shed</option>
                      <option value="insulated-garden-office">Insulated Garden Office</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Location
                    </label>
                    <select className="w-full input-field">
                      <option value="">All Locations</option>
                      <option value="london">London</option>
                      <option value="manchester">Manchester</option>
                      <option value="birmingham">Birmingham</option>
                      <option value="leeds">Leeds</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Minimum Rating
                    </label>
                    <select className="w-full input-field">
                      <option value="">Any Rating</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                  <button className="w-full btn-primary">Apply Filters</button>
                </div>
              </div>
              
              {/* Related Services */}
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Related Services</h3>
                <div className="space-y-2">
                  <Link href="/search?type=garden-office-pod" className="block text-primary-600 hover:text-primary-700">
                    Garden Office Pods
                  </Link>
                  <Link href="/search?type=garden-office-shed" className="block text-primary-600 hover:text-primary-700">
                    Garden Office Sheds
                  </Link>
                  <Link href="/search?type=insulated-garden-office" className="block text-primary-600 hover:text-primary-700">
                    Insulated Garden Offices
                  </Link>
                  <Link href="/search?type=bespoke-garden-office" className="block text-primary-600 hover:text-primary-700">
                    Bespoke Garden Offices
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-secondary-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary-900 mb-6">
              Why Choose Professional {displayType.charAt(0).toUpperCase() + displayType.slice(1)} Builders?
            </h2>
            <div className="prose prose-lg text-secondary-700">
              <p className="mb-4">
                When looking for {displayType} builders in {displayLocation}, it's essential to choose experienced professionals 
                who understand the unique requirements of garden office construction. Professional builders bring expertise in 
                planning permissions, building regulations, and structural requirements specific to garden buildings.
              </p>
              <p className="mb-4">
                Our verified {displayType} builders in {displayLocation} have been carefully selected based on their track record, 
                customer reviews, and commitment to quality. They specialize in creating bespoke garden offices that meet your 
                specific needs while ensuring compliance with all relevant regulations.
              </p>
              <h3 className="text-xl font-semibold text-secondary-900 mb-3">
                What to Look for in a {displayType.charAt(0).toUpperCase() + displayType.slice(1)} Builder
              </h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Experience with garden office construction and planning permissions</li>
                <li>High-quality materials and insulation for year-round use</li>
                <li>Professional installation and project management</li>
                <li>Warranty and after-sales support</li>
                <li>Positive customer reviews and testimonials</li>
              </ul>
              <p>
                Contact our featured {displayType} builders in {displayLocation} today to discuss your project requirements 
                and get a personalized quote for your garden office.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}



