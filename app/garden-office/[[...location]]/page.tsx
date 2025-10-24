import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface GardenOfficePageProps {
  params: {
    location?: string[]
  }
}

export async function generateMetadata({ params }: GardenOfficePageProps): Promise<Metadata> {
  const location = params.location?.[0] || 'uk'
  const displayLocation = location.replace(/-/g, ' ')
  
  return {
    title: `Garden Office Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)} | Professional Garden Office Construction`,
    description: `Find the best garden office builders in ${displayLocation}. Compare prices, read reviews, and get quotes from verified garden office specialists. Professional installation and bespoke designs.`,
    keywords: `garden office ${displayLocation}, garden office builders ${displayLocation}, garden office construction ${displayLocation}, garden office installation ${displayLocation}`,
    openGraph: {
      title: `Garden Office Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)}`,
      description: `Find the best garden office builders in ${displayLocation}. Professional installation and bespoke designs.`,
      type: 'website',
      locale: 'en_GB',
    },
  }
}

export default function GardenOfficePage({ params }: GardenOfficePageProps) {
  const location = params.location?.[0] || 'uk'
  
  // Redirect to search page with proper parameters
  redirect(`/search?type=garden-office&location=${location}`)
}



