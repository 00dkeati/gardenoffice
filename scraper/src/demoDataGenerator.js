const fs = require('fs-extra');
const chalk = require('chalk');
const { ukLocations } = require('./config/uk-locations');

class DemoDataGenerator {
  constructor() {
    this.companies = [];
  }

  generateMockCompany(location, county, keyword) {
    const companyTypes = [
      'Garden Office Solutions',
      'Premier Garden Rooms',
      'Eco Garden Buildings',
      'Modern Garden Studios',
      'Bespoke Garden Offices',
      'Luxury Garden Pods',
      'Professional Garden Buildings',
      'Custom Garden Rooms',
      'Garden Office Specialists',
      'Elite Garden Studios'
    ];

    const company = companyTypes[Math.floor(Math.random() * companyTypes.length)];
    const suffix = Math.floor(Math.random() * 100);
    const name = `${company} ${suffix}`;
    
    return {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
      description: `Professional ${keyword.replace(/-/g, ' ')} builders in ${location}, ${county}. Specializing in high-quality garden office construction with excellent customer service.`,
      website: `https://${name.toLowerCase().replace(/\s+/g, '')}.co.uk`,
      phone: `0${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `info@${name.toLowerCase().replace(/\s+/g, '')}.co.uk`,
      address: `${Math.floor(Math.random() * 999) + 1} High Street`,
      city: location,
      county: county,
      postcode: this.generatePostcode(),
      services: this.generateServices(keyword),
      verified: Math.random() > 0.3,
      featured: Math.random() > 0.7,
      active: true,
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviewCount: Math.floor(Math.random() * 200) + 10,
      images: [],
      metaTitle: `${keyword.replace(/-/g, ' ').charAt(0).toUpperCase() + keyword.replace(/-/g, ' ').slice(1)} Builders in ${location} | ${name}`,
      metaDescription: `Find the best ${keyword.replace(/-/g, ' ')} builders in ${location}, ${county}. Professional installation and quality materials.`,
      source: 'demo_generator',
      sourceUrl: null,
      extractedAt: new Date().toISOString()
    };
  }

  generatePostcode() {
    const areas = ['SW', 'SE', 'NW', 'NE', 'W', 'E', 'N', 'S', 'EC', 'WC'];
    const area = areas[Math.floor(Math.random() * areas.length)];
    const district = Math.floor(Math.random() * 99) + 1;
    const sector = Math.floor(Math.random() * 9);
    const unit = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `${area}${district} ${sector}${unit}${unit}`;
  }

  generateServices(keyword) {
    const baseServices = [keyword];
    const additionalServices = [
      'garden-office',
      'garden-office-pod',
      'garden-office-shed',
      'garden-room',
      'garden-building',
      'insulated-garden-office',
      'bespoke-garden-office'
    ];

    const numServices = Math.floor(Math.random() * 3) + 1;
    const services = [keyword];
    
    for (let i = 0; i < numServices; i++) {
      const service = additionalServices[Math.floor(Math.random() * additionalServices.length)];
      if (!services.includes(service)) {
        services.push(service);
      }
    }

    return services.join(',');
  }

  async generateDemoData() {
    console.log(chalk.blue('🎭 Generating demo garden office company data...'));
    
    const keywords = [
      'garden-office',
      'garden-office-pod',
      'garden-office-shed',
      'garden-office-uk',
      'small-garden-office',
      'garden-office-for-sale',
      'garden-office-room',
      'garden-office-sale',
      'garden-office-buildings',
      'insulated-garden-office'
    ];

    let totalCompanies = 0;
    const locations = [];

    // Generate companies for major UK cities
    const majorCities = [
      { location: 'London', county: 'Greater London' },
      { location: 'Birmingham', county: 'West Midlands' },
      { location: 'Manchester', county: 'Greater Manchester' },
      { location: 'Leeds', county: 'West Yorkshire' },
      { location: 'Glasgow', county: 'Glasgow' },
      { location: 'Edinburgh', county: 'Edinburgh' },
      { location: 'Liverpool', county: 'Merseyside' },
      { location: 'Bristol', county: 'Bristol' },
      { location: 'Sheffield', county: 'South Yorkshire' },
      { location: 'Leicester', county: 'Leicestershire' },
      { location: 'Coventry', county: 'West Midlands' },
      { location: 'Cardiff', county: 'Cardiff' },
      { location: 'Belfast', county: 'Belfast' },
      { location: 'Nottingham', county: 'Nottinghamshire' },
      { location: 'Newcastle', county: 'Tyne and Wear' },
      { location: 'Southampton', county: 'Hampshire' },
      { location: 'Derby', county: 'Derbyshire' },
      { location: 'Portsmouth', county: 'Hampshire' },
      { location: 'Brighton', county: 'East Sussex' },
      { location: 'Plymouth', county: 'Devon' }
    ];

    for (const city of majorCities) {
      console.log(chalk.yellow(`📍 Generating companies for ${city.location}, ${city.county}...`));
      
      const locationCompanies = [];
      
      // Generate 3-5 companies per city per keyword
      for (const keyword of keywords) {
        const numCompanies = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < numCompanies; i++) {
          const company = this.generateMockCompany(city.location, city.county, keyword);
          locationCompanies.push(company);
          totalCompanies++;
        }
      }

      // Save location data
      const locationData = {
        location: city.location,
        county: city.county,
        companies: locationCompanies,
        scrapedAt: new Date().toISOString()
      };

      await fs.writeJson(
        `./output/raw/${city.location.replace(/\s+/g, '_')}_${city.county.replace(/\s+/g, '_')}.json`,
        locationData,
        { spaces: 2 }
      );

      this.companies.push(...locationCompanies);
      console.log(chalk.green(`  ✅ Generated ${locationCompanies.length} companies for ${city.location}`));
    }

    // Save all companies
    await fs.writeJson('./output/processed/all_companies_demo.json', this.companies, { spaces: 2 });
    await fs.writeJson('./output/processed/all_companies_current.json', this.companies, { spaces: 2 });

    console.log(chalk.green(`\n🎉 Demo data generation completed!`));
    console.log(chalk.green(`📊 Generated ${totalCompanies} companies across ${majorCities.length} cities`));
    console.log(chalk.green(`💾 Data saved to ./output/processed/all_companies_current.json`));

    return this.companies;
  }
}

// Main execution
async function main() {
  const generator = new DemoDataGenerator();
  
  try {
    await generator.generateDemoData();
  } catch (error) {
    console.error(chalk.red('❌ Error generating demo data:'), error);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = DemoDataGenerator;
