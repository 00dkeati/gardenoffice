import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface GardenofficeukPageProps {
  params: {
    location?: string[]
  }
}

export async function generateMetadata({ params }: GardenofficeukPageProps): Promise<Metadata> {
  const location = params.location?.[0] || 'uk'
  const displayLocation = location.replace(/-/g, ' ')
  const displayKeyword = 'garden-office-uk'.replace(/-/g, ' ')
  
  return {
    title: `${displayKeyword.charAt(0).toUpperCase() + displayKeyword.slice(1)} Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)} | Professional Construction`,
    description: `Find the best ${displayKeyword} builders in ${displayLocation}. Compare prices, read reviews, and get quotes from verified ${displayKeyword} specialists. Professional installation and quality materials.`,
    keywords: `${displayKeyword} ${displayLocation}, ${displayKeyword} builders ${displayLocation}, ${displayKeyword} construction ${displayLocation}, ${displayKeyword} installation ${displayLocation}`,
    openGraph: {
      title: `${displayKeyword.charAt(0).toUpperCase() + displayKeyword.slice(1)} Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)}`,
      description: `Find the best ${displayKeyword} builders in ${displayLocation}. Professional installation and quality materials.`,
      type: 'website',
      locale: 'en_GB',
    },
  }
}

export default function GardenofficeukPage({ params }: GardenofficeukPageProps) {
  const location = params.location?.[0] || 'uk'
  
  // Redirect to search page with proper parameters
  redirect(`/search?type=garden-office-uk&location=${location}`)
}
