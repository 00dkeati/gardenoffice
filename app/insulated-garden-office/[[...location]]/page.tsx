import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface InsulatedGardenOfficePageProps {
  params: {
    location?: string[]
  }
}

export async function generateMetadata({ params }: InsulatedGardenOfficePageProps): Promise<Metadata> {
  const location = params.location?.[0] || 'uk'
  const displayLocation = location.replace(/-/g, ' ')
  
  return {
    title: `Insulated Garden Office Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)} | Professional Insulated Construction`,
    description: `Find the best insulated garden office builders in ${displayLocation}. Compare prices, read reviews, and get quotes from verified insulated garden office specialists. Year-round comfort and energy efficiency.`,
    keywords: `insulated garden office ${displayLocation}, insulated garden office builders ${displayLocation}, insulated garden room construction ${displayLocation}, insulated garden office installation ${displayLocation}`,
    openGraph: {
      title: `Insulated Garden Office Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)}`,
      description: `Find the best insulated garden office builders in ${displayLocation}. Year-round comfort and energy efficiency.`,
      type: 'website',
      locale: 'en_GB',
    },
  }
}

export default function InsulatedGardenOfficePage({ params }: InsulatedGardenOfficePageProps) {
  const location = params.location?.[0] || 'uk'
  
  // Redirect to search page with proper parameters
  redirect(`/search?type=insulated-garden-office&location=${location}`)
}



