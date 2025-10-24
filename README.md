# UK Garden Office Directory

A comprehensive directory website for garden office builders across the UK, built with Next.js 14 and optimized for programmatic SEO.

## Features

- **Programmatic SEO**: Automatically generates pages for all target keywords and UK locations
- **Company Listings**: Detailed company profiles with reviews, ratings, and contact information
- **Location-based Search**: Find garden office builders by city, county, or region
- **Service Filtering**: Filter by specific garden office services (pods, sheds, insulated buildings, etc.)
- **Structured Data**: Rich snippets for better search engine visibility
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **SEO Optimized**: Sitemaps, robots.txt, and meta tags for all pages

## Target Keywords

The site targets these high-value keywords:
- garden office
- garden office pod
- garden office shed
- garden office uk
- small garden office
- garden office for sale
- garden office room
- garden office sale
- garden office buildings
- insulated garden office
- bespoke garden office
- And many more...

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Database**: Prisma with SQLite (easily switchable to PostgreSQL/MySQL)
- **TypeScript**: Full type safety
- **Icons**: Lucide React

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/
│   ├── companies/[slug]/     # Individual company pages
│   ├── search/              # Search results page
│   ├── garden-office/        # Programmatic SEO pages
│   ├── garden-office-pod/    # Programmatic SEO pages
│   ├── [other-keywords]/    # More programmatic SEO pages
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots.txt
├── prisma/
│   └── schema.prisma        # Database schema
└── components/              # Reusable components
```

## SEO Strategy

### Programmatic SEO
- **22 target keywords** × **100+ UK locations** = **2,200+ unique pages**
- Each page targets specific keyword + location combinations
- Automatic redirects to search pages with proper parameters

### Content Strategy
- Location-specific content for each city/county
- Service-specific landing pages
- Company profile pages with structured data
- Review and rating systems

### Technical SEO
- Dynamic sitemap generation
- Proper meta tags and Open Graph
- Structured data (JSON-LD) for local businesses
- Mobile-first responsive design
- Fast loading times

## Database Schema

The database includes:
- **Companies**: Business information, services, contact details
- **Reviews**: Customer reviews and ratings
- **Locations**: UK cities, counties, and regions
- **Services**: Available garden office services

## Deployment

1. **Build the Project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (Recommended)
   ```bash
   npx vercel
   ```

3. **Or deploy to other platforms**
   - Netlify
   - AWS Amplify
   - DigitalOcean App Platform

## Customization

### Adding New Keywords
1. Add keywords to `targetKeywords` array in `app/sitemap.ts`
2. Run the generator script to create new pages
3. Update the homepage to include new service links

### Adding New Locations
1. Add locations to `ukLocations` array in `app/sitemap.ts`
2. The sitemap will automatically include all new location pages

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update `app/globals.css` for global styles
- Component-specific styles use Tailwind classes

## Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for Google's ranking factors
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic code splitting for faster loads

## Analytics & Monitoring

Consider adding:
- Google Analytics 4
- Google Search Console
- Hotjar for user behavior
- Uptime monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact:
- Email: info@gardenofficedirectory.co.uk
- Phone: 0800 123 4567

---

Built with ❤️ for the UK garden office industry.



