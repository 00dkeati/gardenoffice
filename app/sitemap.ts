import { MetadataRoute } from 'next'

const targetKeywords = [
  'garden-office',
  'garden-office-pod',
  'garden-office-shed',
  'garden-office-uk',
  'small-garden-office',
  'garden-office-for-sale',
  'garden-office-room',
  'garden-office-sale',
  'garden-office-buildings',
  'insulate-garden-office',
  'insulated-garden-office',
  'shed-garden-office',
  'garden-office-and-shed',
  'home-garden-office',
  'garden-office-pod-cheap',
  'bespoke-garden-office',
  'garden-office-rooms',
  'garden-office-building',
  'cheap-garden-office-pod',
  'garden-office-build',
  'uk-garden-office',
  'garden-office-and-storage-shed'
]

const ukLocations = [
  'london', 'birmingham', 'manchester', 'leeds', 'glasgow', 'edinburgh',
  'liverpool', 'bristol', 'sheffield', 'leicester', 'coventry', 'cardiff',
  'belfast', 'nottingham', 'hull', 'newcastle', 'stoke-on-trent', 'southampton',
  'derby', 'portsmouth', 'brighton', 'plymouth', 'northampton', 'reading',
  'norwich', 'luton', 'wolverhampton', 'bolton', 'bournemouth', 'swindon',
  'bath', 'cambridge', 'oxford', 'york', 'canterbury', 'exeter', 'lincoln',
  'chester', 'durham', 'winchester', 'worcester', 'gloucester', 'salisbury',
  'chichester', 'truro', 'st-albans', 'colchester', 'ipswich', 'norwich',
  'peterborough', 'milton-keynes', 'luton', 'watford', 'slough', 'reading',
  'basingstoke', 'southampton', 'portsmouth', 'brighton', 'crawley', 'eastbourne',
  'hastings', 'maidstone', 'canterbury', 'dover', 'folkestone', 'margate',
  'ramsgate', 'broadstairs', 'deal', 'sandwich', 'whitstable', 'faversham',
  'sittingbourne', 'chatham', 'rochester', 'gillingham', 'medway', 'gravesend',
  'dartford', 'bexleyheath', 'sidcup', 'orpington', 'bromley', 'beckenham',
  'croydon', 'sutton', 'kingston-upon-thames', 'richmond', 'twickenham',
  'hammersmith', 'fulham', 'chelsea', 'kensington', 'westminster', 'camden',
  'islington', 'hackney', 'tower-hamlets', 'newham', 'waltham-forest',
  'redbridge', 'havering', 'barking-and-dagenham', 'greenwich', 'lewisham',
  'southwark', 'lambeth', 'wandsworth', 'merton', 'kingston', 'sutton',
  'croydon', 'bromley', 'bexley', 'greenwich', 'lewisham', 'southwark',
  'lambeth', 'wandsworth', 'merton', 'kingston', 'richmond-upon-thames',
  'hillingdon', 'ealing', 'harrow', 'brent', 'barnet', 'enfield', 'haringey'
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://gardenofficedirectory.co.uk'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Programmatic SEO pages for each keyword + location combination
  const programmaticPages: MetadataRoute.Sitemap = []
  
  targetKeywords.forEach(keyword => {
    // Add the main keyword page
    programmaticPages.push({
      url: `${baseUrl}/${keyword}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })
    
    // Add location-specific pages for each keyword
    ukLocations.forEach(location => {
      programmaticPages.push({
        url: `${baseUrl}/${keyword}/${location}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      })
    })
  })

  // Search pages for each keyword
  targetKeywords.forEach(keyword => {
    programmaticPages.push({
      url: `${baseUrl}/search?type=${keyword}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  })

  // Location pages
  ukLocations.forEach(location => {
    programmaticPages.push({
      url: `${baseUrl}/search?location=${location}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })
  })

  return [...staticPages, ...programmaticPages]
}



