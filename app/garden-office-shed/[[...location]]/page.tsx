import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface GardenOfficeShedPageProps {
  params: {
    location?: string[]
  }
}

export async function generateMetadata({ params }: GardenOfficeShedPageProps): Promise<Metadata> {
  const location = params.location?.[0] || 'uk'
  const displayLocation = location.replace(/-/g, ' ')
  
  return {
    title: `Garden Office Shed Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)} | Professional Shed Construction`,
    description: `Find the best garden office shed builders in ${displayLocation}. Compare prices, read reviews, and get quotes from verified garden office shed specialists. Quality materials and expert installation.`,
    keywords: `garden office shed ${displayLocation}, garden office shed builders ${displayLocation}, garden shed construction ${displayLocation}, garden office shed installation ${displayLocation}`,
    openGraph: {
      title: `Garden Office Shed Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)}`,
      description: `Find the best garden office shed builders in ${displayLocation}. Quality materials and expert installation.`,
      type: 'website',
      locale: 'en_GB',
    },
  }
}

export default function GardenOfficeShedPage({ params }: GardenOfficeShedPageProps) {
  const location = params.location?.[0] || 'uk'
  
  // Redirect to search page with proper parameters
  redirect(`/search?type=garden-office-shed&location=${location}`)
}



