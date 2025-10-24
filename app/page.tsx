import Link from 'next/link'
import { Search, MapPin, Star, Phone, Mail, Globe } from 'lucide-react'

export default function HomePage() {
  const targetKeywords = [
    'garden office',
    'garden office pod',
    'garden office shed',
    'garden office uk',
    'garden office small',
    'garden office for sale',
    'garden office room',
    'garden office sale',
    'garden office buildings',
    'insulate garden office',
    'insulated garden office',
    'shed garden office',
    'garden office and shed',
    'small garden office',
    'home garden office',
    'garden office pod cheap',
    'bespoke garden office',
    'garden office rooms',
    'garden office building',
    'cheap garden office pod',
    'garden office build',
    'uk garden office',
    'garden office and storage shed'
  ]

  const ukLocations = [
    'London', 'Birmingham', 'Manchester', 'Leeds', 'Glasgow', 'Edinburgh',
    'Liverpool', 'Bristol', 'Sheffield', 'Leicester', 'Coventry', 'Cardiff',
    'Belfast', 'Nottingham', 'Hull', 'Newcastle', 'Stoke-on-Trent', 'Southampton',
    'Derby', 'Portsmouth', 'Brighton', 'Plymouth', 'Northampton', 'Reading',
    'Norwich', 'Luton', 'Wolverhampton', 'Bolton', 'Bournemouth', 'Swindon'
  ]

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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-secondary-900 mb-6">
              Find the Best Garden Office Builders in the UK
            </h1>
            <p className="text-xl text-secondary-600 mb-8">
              Discover local companies specializing in garden offices, pods, sheds, and insulated buildings. 
              Compare prices, read reviews, and find your perfect garden office builder.
            </p>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for garden office builders..."
                    className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="sm:w-48 relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <select className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">All Locations</option>
                    {ukLocations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary px-8 py-3">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Popular Garden Office Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetKeywords.slice(0, 9).map((keyword, index) => (
              <Link
                key={index}
                href={`/search?type=${keyword.replace(/\s+/g, '-')}`}
                className="card hover:shadow-md transition-shadow duration-200 group"
              >
                <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 mb-2">
                  {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
                </h3>
                <p className="text-secondary-600">
                  Find local builders specializing in {keyword} across the UK
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Location-based Search */}
      <section className="py-16 bg-secondary-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Find Garden Office Builders by Location
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ukLocations.map((location, index) => (
              <Link
                key={index}
                href={`/search?location=${location}`}
                className="text-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group"
              >
                <MapPin className="w-6 h-6 text-primary-600 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="text-sm font-medium text-secondary-900 group-hover:text-primary-600">
                  {location}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Why Choose Our Directory?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Verified Reviews
              </h3>
              <p className="text-secondary-600">
                Read genuine reviews from customers who have worked with these garden office builders.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Local Expertise
              </h3>
              <p className="text-secondary-600">
                Find builders in your area who understand local planning requirements and regulations.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Comprehensive Coverage
              </h3>
              <p className="text-secondary-600">
                From garden offices to pods, sheds, and insulated buildings - we cover all services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Garden Office Directory</h3>
              <p className="text-secondary-300">
                The UK's most comprehensive directory of garden office builders and specialists.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-secondary-300">
                <li><Link href="/search?type=garden-office" className="hover:text-white">Garden Offices</Link></li>
                <li><Link href="/search?type=garden-office-pod" className="hover:text-white">Garden Office Pods</Link></li>
                <li><Link href="/search?type=garden-office-shed" className="hover:text-white">Garden Office Sheds</Link></li>
                <li><Link href="/search?type=insulated-garden-office" className="hover:text-white">Insulated Buildings</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Popular Locations</h4>
              <ul className="space-y-2 text-secondary-300">
                <li><Link href="/search?location=London" className="hover:text-white">London</Link></li>
                <li><Link href="/search?location=Birmingham" className="hover:text-white">Birmingham</Link></li>
                <li><Link href="/search?location=Manchester" className="hover:text-white">Manchester</Link></li>
                <li><Link href="/search?location=Leeds" className="hover:text-white">Leeds</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-secondary-300">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@gardenofficedirectory.co.uk
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  0800 123 4567
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-secondary-700 mt-8 pt-8 text-center text-secondary-300">
            <p>&copy; 2024 Garden Office Directory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}



