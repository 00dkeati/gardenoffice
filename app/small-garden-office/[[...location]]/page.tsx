import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface SmallGardenOfficePageProps {
  params: {
    location?: string[]
  }
}

export async function generateMetadata({ params }: SmallGardenOfficePageProps): Promise<Metadata> {
  const location = params.location?.[0] || 'uk'
  const displayLocation = location.replace(/-/g, ' ')
  
  return {
    title: `Small Garden Office Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)} | Compact Garden Office Construction`,
    description: `Find the best small garden office builders in ${displayLocation}. Compare prices, read reviews, and get quotes from verified small garden office specialists. Perfect for compact spaces and budget-friendly solutions.`,
    keywords: `small garden office ${displayLocation}, small garden office builders ${displayLocation}, compact garden office construction ${displayLocation}, small garden office installation ${displayLocation}`,
    openGraph: {
      title: `Small Garden Office Builders in ${displayLocation.charAt(0).toUpperCase() + displayLocation.slice(1)}`,
      description: `Find the best small garden office builders in ${displayLocation}. Perfect for compact spaces and budget-friendly solutions.`,
      type: 'website',
      locale: 'en_GB',
    },
  }
}

export default function SmallGardenOfficePage({ params }: SmallGardenOfficePageProps) {
  const location = params.location?.[0] || 'uk'
  
  // Redirect to search page with proper parameters
  redirect(`/search?type=small-garden-office&location=${location}`)
}



