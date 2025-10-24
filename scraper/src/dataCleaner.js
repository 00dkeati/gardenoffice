const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { ukLocations } = require('./config/uk-locations');

class DataCleaner {
  constructor() {
    this.cleanedData = [];
    this.duplicates = [];
    this.invalidEntries = [];
  }

  async loadRawData() {
    console.log(chalk.blue('📂 Loading raw scraped data...'));
    
    const rawDir = './output/raw';
    const files = await fs.readdir(rawDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    let allData = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(rawDir, file);
        const data = await fs.readJson(filePath);
        
        if (data.companies && Array.isArray(data.companies)) {
          allData.push(...data.companies);
          console.log(chalk.green(`  ✅ Loaded ${data.companies.length} companies from ${file}`));
        }
      } catch (error) {
        console.log(chalk.red(`  ❌ Error loading ${file}: ${error.message}`));
      }
    }
    
    console.log(chalk.green(`📊 Total raw entries loaded: ${allData.length}`));
    return allData;
  }

  cleanCompanyData(company) {
    const cleaned = {
      name: this.cleanText(company.name),
      slug: this.generateSlug(company.name),
      description: this.cleanText(company.description),
      website: this.cleanUrl(company.website),
      phone: this.cleanPhone(company.phone),
      email: this.cleanEmail(company.email),
      address: this.cleanText(company.address),
      city: this.cleanText(company.city),
      county: this.cleanText(company.county),
      postcode: this.cleanPostcode(company.postcode),
      services: this.cleanServices(company.services),
      source: company.source,
      sourceUrl: company.sourceUrl,
      extractedAt: company.extractedAt,
      verified: false,
      featured: false,
      active: true,
      rating: null,
      reviewCount: 0,
      images: [],
      metaTitle: null,
      metaDescription: null
    };

    // Validate required fields
    if (!cleaned.name || cleaned.name.length < 2) {
      return null;
    }

    return cleaned;
  }

  cleanText(text) {
    if (!text) return null;
    
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s\-.,&()]/g, '')
      .trim();
  }

  cleanUrl(url) {
    if (!url) return null;
    
    // Handle relative URLs
    if (url.startsWith('/')) {
      return url;
    }
    
    // Clean up common URL issues
    url = url.replace(/^(https?:\/\/)?(www\.)?/, 'https://www.');
    
    // Validate URL format
    try {
      new URL(url);
      return url;
    } catch {
      return null;
    }
  }

  cleanPhone(phone) {
    if (!phone) return null;
    
    // Remove all non-digit characters except + and spaces
    let cleaned = phone.replace(/[^\d+\s]/g, '');
    
    // Handle UK phone numbers
    if (cleaned.startsWith('0')) {
      cleaned = '+44' + cleaned.substring(1);
    }
    
    // Remove extra spaces
    cleaned = cleaned.replace(/\s+/g, '');
    
    // Validate phone number length
    if (cleaned.length < 10 || cleaned.length > 15) {
      return null;
    }
    
    return cleaned;
  }

  cleanEmail(email) {
    if (!email) return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(email)) {
      return email.toLowerCase();
    }
    
    return null;
  }

  cleanPostcode(postcode) {
    if (!postcode) return null;
    
    // UK postcode format validation
    const ukPostcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
    
    if (ukPostcodeRegex.test(postcode)) {
      return postcode.toUpperCase().replace(/\s+/g, ' ');
    }
    
    return null;
  }

  cleanServices(services) {
    if (!services) return null;
    
    if (typeof services === 'string') {
      return services;
    }
    
    if (!Array.isArray(services)) {
      return null;
    }
    
    const serviceMap = {
      'garden office': 'garden-office',
      'garden office pod': 'garden-office-pod',
      'garden office shed': 'garden-office-shed',
      'garden room': 'garden-room',
      'garden building': 'garden-building',
      'garden studio': 'garden-studio',
      'garden workspace': 'garden-workspace',
      'garden annex': 'garden-annex',
      'garden extension': 'garden-extension',
      'garden cabin': 'garden-cabin',
      'garden lodge': 'garden-lodge',
      'garden retreat': 'garden-retreat',
      'garden office building': 'garden-office-building',
      'garden office construction': 'garden-office-construction',
      'garden office installation': 'garden-office-installation',
      'garden office builders': 'garden-office-builders',
      'garden office company': 'garden-office-company',
      'garden office specialist': 'garden-office-specialist',
      'garden office contractor': 'garden-office-contractor',
      'garden office manufacturer': 'garden-office-manufacturer',
      'garden office supplier': 'garden-office-supplier',
      'garden office designer': 'garden-office-designer',
      'garden office installer': 'garden-office-installer',
      'garden office provider': 'garden-office-provider',
      'garden office service': 'garden-office-service',
      'garden office solutions': 'garden-office-solutions',
      'bespoke garden office': 'bespoke-garden-office',
      'custom garden office': 'custom-garden-office',
      'designer garden office': 'designer-garden-office',
      'luxury garden office': 'luxury-garden-office',
      'premium garden office': 'premium-garden-office',
      'high quality garden office': 'high-quality-garden-office',
      'professional garden office': 'professional-garden-office',
      'modern garden office': 'modern-garden-office',
      'contemporary garden office': 'contemporary-garden-office',
      'traditional garden office': 'traditional-garden-office',
      'insulated garden office': 'insulated-garden-office',
      'garden office insulation': 'garden-office-insulation',
      'garden office heating': 'garden-office-heating',
      'garden office cooling': 'garden-office-cooling',
      'garden office ventilation': 'garden-office-ventilation',
      'garden office electrical': 'garden-office-electrical',
      'garden office plumbing': 'garden-office-plumbing',
      'garden office broadband': 'garden-office-broadband',
      'garden office internet': 'garden-office-internet',
      'garden office wifi': 'garden-office-wifi',
      'garden office power': 'garden-office-power',
      'garden office lighting': 'garden-office-lighting',
      'garden office windows': 'garden-office-windows',
      'garden office doors': 'garden-office-doors',
      'garden office flooring': 'garden-office-flooring',
      'garden office walls': 'garden-office-walls',
      'garden office roof': 'garden-office-roof',
      'garden office foundation': 'garden-office-foundation',
      'garden office base': 'garden-office-base',
      'garden office planning permission': 'garden-office-planning-permission',
      'garden office building regulations': 'garden-office-building-regulations',
      'garden office planning': 'garden-office-planning',
      'garden office consent': 'garden-office-consent',
      'garden office approval': 'garden-office-approval',
      'garden office permitted development': 'garden-office-permitted-development',
      'garden office pd': 'garden-office-pd',
      'garden office size': 'garden-office-size',
      'garden office dimensions': 'garden-office-dimensions',
      'garden office measurements': 'garden-office-measurements',
      'garden office area': 'garden-office-area',
      'garden office space': 'garden-office-space',
      'garden office room': 'garden-office-room',
      'garden office studio': 'garden-office-studio',
      'garden office workspace': 'garden-office-workspace',
      'garden office office space': 'garden-office-office-space',
      'garden office home office': 'garden-office-home-office',
      'garden office remote work': 'garden-office-remote-work',
      'garden office work from home': 'garden-office-work-from-home',
      'garden office home working': 'garden-office-home-working',
      'garden office freelance': 'garden-office-freelance',
      'garden office business': 'garden-office-business',
      'garden office commercial': 'garden-office-commercial',
      'garden office residential': 'garden-office-residential',
      'garden office domestic': 'garden-office-domestic',
      'garden office private': 'garden-office-private',
      'garden office personal': 'garden-office-personal',
      'garden office family': 'garden-office-family',
      'garden office children': 'garden-office-children',
      'garden office teenager': 'garden-office-teenager',
      'garden office student': 'garden-office-student',
      'garden office study': 'garden-office-study',
      'garden office homework': 'garden-office-homework',
      'garden office learning': 'garden-office-learning',
      'garden office education': 'garden-office-education',
      'garden office training': 'garden-office-training',
      'garden office course': 'garden-office-course',
      'garden office workshop': 'garden-office-workshop',
      'garden office craft': 'garden-office-craft',
      'garden office hobby': 'garden-office-hobby',
      'garden office art': 'garden-office-art',
      'garden office music': 'garden-office-music',
      'garden office studio': 'garden-office-studio',
      'garden office recording': 'garden-office-recording',
      'garden office practice': 'garden-office-practice',
      'garden office rehearsal': 'garden-office-rehearsal',
      'garden office gym': 'garden-office-gym',
      'garden office fitness': 'garden-office-fitness',
      'garden office exercise': 'garden-office-exercise',
      'garden office yoga': 'garden-office-yoga',
      'garden office meditation': 'garden-office-meditation',
      'garden office therapy': 'garden-office-therapy',
      'garden office treatment': 'garden-office-treatment',
      'garden office consultation': 'garden-office-consultation',
      'garden office meeting': 'garden-office-meeting',
      'garden office conference': 'garden-office-conference',
      'garden office presentation': 'garden-office-presentation',
      'garden office client': 'garden-office-client',
      'garden office customer': 'garden-office-customer',
      'garden office visitor': 'garden-office-visitor',
      'garden office guest': 'garden-office-guest',
      'garden office accommodation': 'garden-office-accommodation',
      'garden office living': 'garden-office-living',
      'garden office sleeping': 'garden-office-sleeping',
      'garden office bedroom': 'garden-office-bedroom',
      'garden office guest room': 'garden-office-guest-room',
      'garden office spare room': 'garden-office-spare-room',
      'garden office extra room': 'garden-office-extra-room',
      'garden office additional room': 'garden-office-additional-room',
      'garden office annex': 'garden-office-annex',
      'garden office extension': 'garden-office-extension',
      'garden office addition': 'garden-office-addition',
      'garden office conversion': 'garden-office-conversion',
      'garden office renovation': 'garden-office-renovation',
      'garden office refurbishment': 'garden-office-refurbishment',
      'garden office upgrade': 'garden-office-upgrade',
      'garden office improvement': 'garden-office-improvement',
      'garden office enhancement': 'garden-office-enhancement',
      'garden office modification': 'garden-office-modification',
      'garden office alteration': 'garden-office-alteration',
      'garden office adaptation': 'garden-office-adaptation',
      'garden office customization': 'garden-office-customization',
      'garden office personalization': 'garden-office-personalization',
      'garden office tailoring': 'garden-office-tailoring',
      'garden office bespoke': 'garden-office-bespoke',
      'garden office custom': 'garden-office-custom',
      'garden office made to order': 'garden-office-made-to-order',
      'garden office made to measure': 'garden-office-made-to-measure',
      'garden office tailored': 'garden-office-tailored',
      'garden office individual': 'garden-office-individual',
      'garden office unique': 'garden-office-unique',
      'garden office one of a kind': 'garden-office-one-of-a-kind',
      'garden office exclusive': 'garden-office-exclusive',
      'garden office special': 'garden-office-special',
      'garden office premium': 'garden-office-premium',
      'garden office luxury': 'garden-office-luxury',
      'garden office high end': 'garden-office-high-end',
      'garden office top quality': 'garden-office-top-quality',
      'garden office best quality': 'garden-office-best-quality',
      'garden office superior quality': 'garden-office-superior-quality',
      'garden office excellent quality': 'garden-office-excellent-quality',
      'garden office outstanding quality': 'garden-office-outstanding-quality',
      'garden office exceptional quality': 'garden-office-exceptional-quality',
      'garden office amazing quality': 'garden-office-amazing-quality',
      'garden office fantastic quality': 'garden-office-fantastic-quality',
      'garden office wonderful quality': 'garden-office-wonderful-quality',
      'garden office brilliant quality': 'garden-office-brilliant-quality',
      'garden office superb quality': 'garden-office-superb-quality',
      'garden office magnificent quality': 'garden-office-magnificent-quality',
      'garden office perfect quality': 'garden-office-perfect-quality',
      'garden office ideal quality': 'garden-office-ideal-quality',
      'garden office optimal quality': 'garden-office-optimal-quality',
      'garden office maximum quality': 'garden-office-maximum-quality',
      'garden office ultimate quality': 'garden-office-ultimate-quality',
      'garden office supreme quality': 'garden-office-supreme-quality',
      'garden office finest quality': 'garden-office-finest-quality',
      'garden office highest quality': 'garden-office-highest-quality',
      'garden office top grade': 'garden-office-top-grade',
      'garden office best grade': 'garden-office-best-grade',
      'garden office superior grade': 'garden-office-superior-grade',
      'garden office excellent grade': 'garden-office-excellent-grade',
      'garden office outstanding grade': 'garden-office-outstanding-grade',
      'garden office exceptional grade': 'garden-office-exceptional-grade',
      'garden office amazing grade': 'garden-office-amazing-grade',
      'garden office fantastic grade': 'garden-office-fantastic-grade',
      'garden office wonderful grade': 'garden-office-wonderful-grade',
      'garden office brilliant grade': 'garden-office-brilliant-grade',
      'garden office superb grade': 'garden-office-superb-grade',
      'garden office magnificent grade': 'garden-office-magnificent-grade',
      'garden office perfect grade': 'garden-office-perfect-grade',
      'garden office ideal grade': 'garden-office-ideal-grade',
      'garden office optimal grade': 'garden-office-optimal-grade',
      'garden office maximum grade': 'garden-office-maximum-grade',
      'garden office ultimate grade': 'garden-office-ultimate-grade',
      'garden office supreme grade': 'garden-office-supreme-grade',
      'garden office finest grade': 'garden-office-finest-grade',
      'garden office highest grade': 'garden-office-highest-grade'
    };
    
    const cleanedServices = [];
    
    for (const service of services) {
      const cleaned = this.cleanText(service);
      if (cleaned) {
        const mappedService = serviceMap[cleaned.toLowerCase()];
        if (mappedService && !cleanedServices.includes(mappedService)) {
          cleanedServices.push(mappedService);
        }
      }
    }
    
    return cleanedServices.length > 0 ? cleanedServices.join(',') : null;
  }

  generateSlug(name) {
    if (!name) return null;
    
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async removeDuplicates(companies) {
    console.log(chalk.blue('🔍 Removing duplicates...'));
    
    const seen = new Map();
    const unique = [];
    
    for (const company of companies) {
      const key = this.generateCompanyKey(company);
      
      if (seen.has(key)) {
        this.duplicates.push({
          original: seen.get(key),
          duplicate: company
        });
      } else {
        seen.set(key, company);
        unique.push(company);
      }
    }
    
    console.log(chalk.green(`✅ Removed ${this.duplicates.length} duplicates`));
    console.log(chalk.green(`📊 Unique companies: ${unique.length}`));
    
    return unique;
  }

  generateCompanyKey(company) {
    // Create a unique key based on name and location
    const name = (company.name || '').toLowerCase().replace(/[^\w]/g, '');
    const city = (company.city || '').toLowerCase().replace(/[^\w]/g, '');
    const county = (company.county || '').toLowerCase().replace(/[^\w]/g, '');
    
    return `${name}-${city}-${county}`;
  }

  async validateCompanies(companies) {
    console.log(chalk.blue('✅ Validating company data...'));
    
    const valid = [];
    
    for (const company of companies) {
      const isValid = this.validateCompany(company);
      
      if (isValid) {
        valid.push(company);
      } else {
        this.invalidEntries.push(company);
      }
    }
    
    console.log(chalk.green(`✅ Valid companies: ${valid.length}`));
    console.log(chalk.yellow(`⚠️  Invalid entries: ${this.invalidEntries.length}`));
    
    return valid;
  }

  validateCompany(company) {
    // Check required fields
    if (!company.name || company.name.length < 2) {
      return false;
    }
    
    // Check if company has at least one contact method
    if (!company.phone && !company.email && !company.website) {
      return false;
    }
    
    // Check if company has location information
    if (!company.city && !company.county) {
      return false;
    }
    
    return true;
  }

  async cleanData() {
    console.log(chalk.blue('🧹 Starting data cleaning process...'));
    
    // Load raw data
    const rawData = await this.loadRawData();
    
    if (rawData.length === 0) {
      console.log(chalk.yellow('⚠️  No raw data found. Run the scraper first.'));
      return;
    }
    
    // Clean company data
    console.log(chalk.blue('🔧 Cleaning company data...'));
    const cleanedData = [];
    
    for (const company of rawData) {
      const cleaned = this.cleanCompanyData(company);
      if (cleaned) {
        cleanedData.push(cleaned);
      }
    }
    
    console.log(chalk.green(`✅ Cleaned ${cleanedData.length} companies`));
    
    // Remove duplicates
    const uniqueCompanies = await this.removeDuplicates(cleanedData);
    
    // Validate companies
    const validCompanies = await this.validateCompanies(uniqueCompanies);
    
    // Save cleaned data
    await this.saveCleanedData(validCompanies);
    
    // Save reports
    await this.saveReports();
    
    console.log(chalk.green(`\n🎉 Data cleaning completed!`));
    console.log(chalk.green(`📊 Final results:`));
    console.log(chalk.green(`  - Valid companies: ${validCompanies.length}`));
    console.log(chalk.green(`  - Duplicates removed: ${this.duplicates.length}`));
    console.log(chalk.green(`  - Invalid entries: ${this.invalidEntries.length}`));
  }

  async saveCleanedData(companies) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save main cleaned data
    await fs.writeJson(`./output/processed/cleaned_companies_${timestamp}.json`, companies, { spaces: 2 });
    await fs.writeJson('./output/processed/cleaned_companies_current.json', companies, { spaces: 2 });
    
    // Save individual company files
    await fs.ensureDir('./output/companies');
    
    for (const company of companies) {
      const filename = `${company.slug}.json`;
      await fs.writeJson(`./output/companies/${filename}`, company, { spaces: 2 });
    }
    
    console.log(chalk.green(`💾 Saved cleaned data to ./output/processed/`));
  }

  async saveReports() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save duplicates report
    if (this.duplicates.length > 0) {
      await fs.writeJson(`./output/processed/duplicates_${timestamp}.json`, this.duplicates, { spaces: 2 });
    }
    
    // Save invalid entries report
    if (this.invalidEntries.length > 0) {
      await fs.writeJson(`./output/processed/invalid_entries_${timestamp}.json`, this.invalidEntries, { spaces: 2 });
    }
    
    // Save summary report
    const summary = {
      timestamp: new Date().toISOString(),
      totalCompanies: this.cleanedData.length,
      validCompanies: this.cleanedData.length - this.invalidEntries.length,
      duplicatesRemoved: this.duplicates.length,
      invalidEntries: this.invalidEntries.length,
      successRate: ((this.cleanedData.length - this.invalidEntries.length) / this.cleanedData.length * 100).toFixed(2) + '%'
    };
    
    await fs.writeJson(`./output/processed/cleaning_summary_${timestamp}.json`, summary, { spaces: 2 });
    
    console.log(chalk.green(`📊 Reports saved to ./output/processed/`));
  }
}

// Main execution function
async function main() {
  const cleaner = new DataCleaner();
  
  try {
    await cleaner.cleanData();
  } catch (error) {
    console.error(chalk.red('❌ Fatal error:'), error);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DataCleaner;


