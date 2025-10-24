import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UK Garden Office Directory | Find Garden Office Builders Near You',
  description: 'Discover the best garden office builders across the UK. Find local companies specializing in garden offices, pods, sheds, and insulated buildings. Compare prices and read reviews.',
  keywords: 'garden office, garden office uk, garden office builders, garden office pod, garden office shed, insulated garden office, bespoke garden office',
  openGraph: {
    title: 'UK Garden Office Directory | Find Garden Office Builders Near You',
    description: 'Discover the best garden office builders across the UK. Find local companies specializing in garden offices, pods, sheds, and insulated buildings.',
    type: 'website',
    locale: 'en_GB',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <body className={inter.className}>
        <div className="min-h-screen bg-secondary-50">
          {children}
        </div>
      </body>
    </html>
  )
}



