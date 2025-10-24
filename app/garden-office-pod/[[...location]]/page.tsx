import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface GardenOfficePodPageProps {
  params: {
    location?: string[]
  }
}

export async function generateMetadata({ params }: GardenOfficePodPageProps): Promise<Metadata> {
  const location = params.location?.[0] || 'uk'
  const displayLocation = location.replace(/-/g, ' ')
  
  return {
    title: `Garden Office Pod Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)} | Professional Pod Construction`,
    description: `Find the best garden office pod builders in ${displayLocation}. Compare prices, read reviews, and get quotes from verified garden office pod specialists. Modern designs and professional installation.`,
    keywords: `garden office pod ${displayLocation}, garden office pod builders ${displayLocation}, garden pod construction ${displayLocation}, garden office pod installation ${displayLocation}`,
    openGraph: {
      title: `Garden Office Pod Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)}`,
      description: `Find the best garden office pod builders in ${displayLocation}. Modern designs and professional installation.`,
      type: 'website',
      locale: 'en_GB',
    },
  }
}

export default function GardenOfficePodPage({ params }: GardenOfficePodPageProps) {
  const location = params.location?.[0] || 'uk'
  
  // Redirect to search page with proper parameters
  redirect(`/search?type=garden-office-pod&location=${location}`)
}



