import { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Star, Phone, Mail, Globe, CheckCircle, Clock, Award, Users } from 'lucide-react'

interface CompanyPageProps {
  params: {
    slug: string
  }
}

// This would normally come from your database
const mockCompany = {
  id: '1',
  name: 'Garden Office Solutions Ltd',
  slug: 'garden-office-solutions-ltd',
  description: 'Specialists in bespoke garden offices and insulated garden rooms across the UK. With over 15 years of experience, we create beautiful, functional garden offices that enhance your work-life balance.',
  website: 'https://gardenofficesolutions.co.uk',
  phone: '0800 123 4567',
  email: 'info@gardenofficesolutions.co.uk',
  address: '123 Business Park, London Road',
  city: 'London',
  county: 'Greater London',
  postcode: 'SW1A 1AA',
  services: ['garden-office', 'garden-office-pod', 'insulated-garden-office', 'bespoke-garden-office'],
  established: 2008,
  employees: '10-50',
  certifications: ['FMB Registered', 'TrustMark Approved', 'ISO 9001'],
  rating: 4.8,
  reviewCount: 127,
  verified: true,
  featured: true,
  images: ['/images/company1-1.jpg', '/images/company1-2.jpg', '/images/company1-3.jpg'],
  metaTitle: 'Garden Office Solutions Ltd | Professional Garden Office Builders in London',
  metaDescription: 'Leading garden office builders in London. Specialists in bespoke garden offices, pods, and insulated garden rooms. 15+ years experience, TrustMark approved.',
  reviews: [
    {
      id: '1',
      rating: 5,
      title: 'Excellent service and quality',
      content: 'Garden Office Solutions transformed our garden into a beautiful office space. The team was professional, punctual, and the quality of work exceeded our expectations.',
      author: 'Sarah Johnson',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      rating: 5,
      title: 'Highly recommended',
      content: 'From initial consultation to completion, the service was outstanding. Our garden office is exactly what we wanted and the insulation is excellent.',
      author: 'Michael Brown',
      createdAt: '2024-01-10'
    }
  ]
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const company = mockCompany // In real app, fetch from database
  
  return {
    title: company.metaTitle || `${company.name} | Garden Office Builders in ${company.city}`,
    description: company.metaDescription || `${company.description} Contact ${company.name} for garden office construction in ${company.city}, ${company.county}.`,
    keywords: `${company.name}, garden office builders ${company.city}, garden office construction ${company.county}, ${company.services.join(', ')}`,
    openGraph: {
      title: company.metaTitle || `${company.name} | Garden Office Builders`,
      description: company.metaDescription || company.description,
      type: 'website',
      locale: 'en_GB',
      images: company.images.map(img => ({ url: img })),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default function CompanyPage({ params }: CompanyPageProps) {
  const company = mockCompany // In real app, fetch from database
  
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": company.name,
    "description": company.description,
    "url": company.website,
    "telephone": company.phone,
    "email": company.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": company.address,
      "addressLocality": company.city,
      "addressRegion": company.county,
      "postalCode": company.postcode,
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.5074",
      "longitude": "-0.1278"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": company.rating,
      "reviewCount": company.reviewCount
    },
    "foundingDate": company.established?.toString(),
    "numberOfEmployees": company.employees,
    "image": company.images,
    "sameAs": company.website ? [company.website] : [],
    "serviceArea": {
      "@type": "Country",
      "name": "United Kingdom"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Garden Office Services",
      "itemListElement": company.services.map(service => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        }
      }))
    }
  }

  return (
    <div className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
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
            <Link href="/companies" className="text-primary-600 hover:text-primary-700">
              Companies
            </Link>
            <span className="mx-2 text-secondary-400">/</span>
            <span className="text-secondary-600">{company.name}</span>
          </nav>
        </div>
      </div>

      {/* Company Header */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Globe className="w-12 h-12 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                    {company.name}
                  </h1>
                  {company.verified && (
                    <div className="flex items-center text-sm text-green-600 mb-2">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified Company
                    </div>
                  )}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold text-lg">{company.rating}</span>
                      <span className="ml-1 text-secondary-600">({company.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {company.city}, {company.county}
                    </div>
                  </div>
                  <p className="text-lg text-secondary-700 mb-6">{company.description}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {company.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-primary-600" />
                      <a href={`tel:${company.phone}`} className="text-secondary-700 hover:text-primary-600">
                        {company.phone}
                      </a>
                    </div>
                  )}
                  {company.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-primary-600" />
                      <a href={`mailto:${company.email}`} className="text-secondary-700 hover:text-primary-600">
                        {company.email}
                      </a>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-primary-600" />
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-secondary-700 hover:text-primary-600">
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
                <div className="mt-6 space-y-2">
                  <button className="w-full btn-primary">Get Quote</button>
                  <button className="w-full btn-secondary">Call Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Details */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Services */}
              <div className="card">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Services Offered</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.services.map((service) => (
                    <div key={service} className="flex items-center p-3 bg-secondary-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-secondary-900 font-medium">
                        {service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Info */}
              <div className="card">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {company.established && (
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-primary-600 mr-3" />
                      <div>
                        <div className="font-medium text-secondary-900">Established</div>
                        <div className="text-secondary-600">{company.established}</div>
                      </div>
                    </div>
                  )}
                  {company.employees && (
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-primary-600 mr-3" />
                      <div>
                        <div className="font-medium text-secondary-900">Team Size</div>
                        <div className="text-secondary-600">{company.employees} employees</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {company.certifications.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.certifications.map((cert) => (
                        <span key={cert} className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reviews */}
              <div className="card">
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Customer Reviews</h2>
                <div className="space-y-6">
                  {company.reviews.map((review) => (
                    <div key={review.id} className="border-b border-secondary-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-secondary-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium text-secondary-900">{review.title}</span>
                        </div>
                        <span className="text-sm text-secondary-500">{review.author}</span>
                      </div>
                      <p className="text-secondary-700">{review.content}</p>
                      <div className="text-sm text-secondary-500 mt-2">{review.createdAt}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Location */}
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Location</h3>
                <div className="text-secondary-700">
                  <div>{company.address}</div>
                  <div>{company.city}, {company.county}</div>
                  <div>{company.postcode}</div>
                </div>
              </div>
              
              {/* Similar Companies */}
              <div className="card">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Similar Companies</h3>
                <div className="space-y-3">
                  <Link href="/companies/premier-garden-rooms" className="block p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                    <div className="font-medium text-secondary-900">Premier Garden Rooms</div>
                    <div className="text-sm text-secondary-600">Manchester • 4.9★</div>
                  </Link>
                  <Link href="/companies/eco-garden-buildings" className="block p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors">
                    <div className="font-medium text-secondary-900">Eco Garden Buildings</div>
                    <div className="text-sm text-secondary-600">Birmingham • 4.7★</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}



