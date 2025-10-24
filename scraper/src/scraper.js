const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { ukLocations, gardenOfficeKeywords, searchSources, businessDirectories } = require('./config/uk-locations');
const OpenAI = require('openai');
const chalk = require('chalk');
const ProgressBar = require('progress');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class GardenOfficeScraper {
  constructor() {
    this.browser = null;
    this.scrapedData = [];
    this.processedUrls = new Set();
    this.delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  }

  async initialize() {
    console.log(chalk.blue('🚀 Initializing Garden Office Scraper...'));
    
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    // Create output directory
    await fs.ensureDir('./output');
    await fs.ensureDir('./output/raw');
    await fs.ensureDir('./output/processed');
    await fs.ensureDir('./output/companies');

    console.log(chalk.green('✅ Scraper initialized successfully'));
  }

  async scrapeSearchEngines(keyword, location) {
    console.log(chalk.yellow(`🔍 Scraping search engines for: "${keyword}" in ${location}`));
    
    const searchResults = [];
    const searchQuery = `"${keyword}" "${location}"`;

    for (const source of searchSources) {
      try {
        console.log(chalk.blue(`  📡 Searching ${source.name}...`));
        
        const page = await this.browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        const searchUrl = `${source.url}${encodeURIComponent(searchQuery)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });
        
        await this.delay(2000); // Be respectful

        const content = await page.content();
        const $ = cheerio.load(content);

        $(source.selectors.results).each((i, element) => {
          const title = $(element).find(source.selectors.title).text().trim();
          const link = $(element).find(source.selectors.link).attr('href');
          const description = $(element).find(source.selectors.description).text().trim();

          if (title && link && this.isRelevantResult(title, description, keyword)) {
            searchResults.push({
              title,
              link: this.cleanUrl(link),
              description,
              source: source.name,
              keyword,
              location
            });
          }
        });

        await page.close();
        console.log(chalk.green(`  ✅ Found ${$(source.selectors.results).length} results from ${source.name}`));
        
      } catch (error) {
        console.log(chalk.red(`  ❌ Error scraping ${source.name}: ${error.message}`));
      }
    }

    return searchResults;
  }

  async scrapeBusinessDirectories(keyword, location) {
    console.log(chalk.yellow(`🏢 Scraping business directories for: "${keyword}" in ${location}`));
    
    const directoryResults = [];

    for (const directory of businessDirectories) {
      try {
        console.log(chalk.blue(`  📡 Searching ${directory.name}...`));
        
        const page = await this.browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        const searchUrl = `${directory.url}${encodeURIComponent(keyword)}${directory.locationParam}${encodeURIComponent(location)}`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });
        
        await this.delay(2000);

        const content = await page.content();
        const $ = cheerio.load(content);

        $(directory.selectors.results).each((i, element) => {
          const name = $(element).find(directory.selectors.name).text().trim();
          const phone = $(element).find(directory.selectors.phone).text().trim();
          const address = $(element).find(directory.selectors.address).text().trim();
          const website = $(element).find(directory.selectors.website).attr('href');
          const description = $(element).find(directory.selectors.description).text().trim();

          if (name && this.isRelevantResult(name, description, keyword)) {
            directoryResults.push({
              name,
              phone,
              address,
              website: this.cleanUrl(website),
              description,
              source: directory.name,
              keyword,
              location
            });
          }
        });

        await page.close();
        console.log(chalk.green(`  ✅ Found ${$(directory.selectors.results).length} results from ${directory.name}`));
        
      } catch (error) {
        console.log(chalk.red(`  ❌ Error scraping ${directory.name}: ${error.message}`));
      }
    }

    return directoryResults;
  }

  async extractCompanyDetails(url) {
    if (this.processedUrls.has(url)) {
      return null;
    }

    this.processedUrls.add(url);

    try {
      console.log(chalk.blue(`  🔍 Extracting details from: ${url}`));
      
      const page = await this.browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await this.delay(1000);

      const content = await page.content();
      const $ = cheerio.load(content);

      // Extract company information using AI
      const companyData = await this.extractCompanyDataWithAI(content, url);
      
      await page.close();
      return companyData;
      
    } catch (error) {
      console.log(chalk.red(`  ❌ Error extracting details from ${url}: ${error.message}`));
      return null;
    }
  }

  async extractCompanyDataWithAI(content, url) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an expert at extracting company information from web pages. Extract the following information about garden office companies:
            
            - Company name
            - Phone number
            - Email address
            - Physical address
            - Website URL
            - Services offered
            - Description
            - Location (city, county, postcode)
            - Social media links
            - Any other relevant contact information
            
            Return the data in JSON format. If information is not available, use null.`
          },
          {
            role: "user",
            content: `Extract company information from this web page content:\n\n${content.substring(0, 8000)}`
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      });

      const extractedData = JSON.parse(response.choices[0].message.content);
      extractedData.sourceUrl = url;
      extractedData.extractedAt = new Date().toISOString();
      
      return extractedData;
      
    } catch (error) {
      console.log(chalk.red(`  ❌ Error extracting data with AI: ${error.message}`));
      return null;
    }
  }

  isRelevantResult(title, description, keyword) {
    const relevantTerms = [
      'garden office', 'garden room', 'garden building', 'garden pod',
      'garden shed', 'garden studio', 'garden workspace', 'garden annex',
      'garden extension', 'garden cabin', 'garden lodge', 'garden retreat',
      'garden workspace', 'garden office pod', 'garden office building',
      'garden office construction', 'garden office installation',
      'garden office builders', 'garden office company', 'garden office specialist',
      'garden office contractor', 'garden office manufacturer', 'garden office supplier',
      'garden office designer', 'garden office installer', 'garden office provider',
      'garden office service', 'garden office solutions'
    ];

    const text = `${title} ${description}`.toLowerCase();
    return relevantTerms.some(term => text.includes(term.toLowerCase()));
  }

  cleanUrl(url) {
    if (!url) return null;
    
    // Handle relative URLs
    if (url.startsWith('/')) {
      return url;
    }
    
    // Clean up Google redirects and other tracking URLs
    if (url.includes('google.com/url')) {
      const match = url.match(/url\?q=([^&]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }
    
    return url;
  }

  async scrapeLocation(location, county) {
    console.log(chalk.cyan(`\n📍 Scraping location: ${location}, ${county}`));
    
    const locationData = {
      location,
      county,
      companies: [],
      scrapedAt: new Date().toISOString()
    };

    // Use a subset of keywords for efficiency
    const keywordsToUse = gardenOfficeKeywords.slice(0, 20);
    
    const bar = new ProgressBar(`  ${location} [:bar] :current/:total`, {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: keywordsToUse.length
    });

    for (const keyword of keywordsToUse) {
      try {
        // Scrape search engines
        const searchResults = await this.scrapeSearchEngines(keyword, location);
        
        // Scrape business directories
        const directoryResults = await this.scrapeBusinessDirectories(keyword, location);
        
        // Extract detailed company information
        const companies = [];
        
        // Process search results
        for (const result of searchResults.slice(0, 5)) { // Limit to top 5 results
          if (result.link && !result.link.startsWith('#')) {
            const companyData = await this.extractCompanyDetails(result.link);
            if (companyData) {
              companies.push({
                ...companyData,
                ...result,
                source: 'search_engine'
              });
            }
          }
        }
        
        // Process directory results
        for (const result of directoryResults) {
          companies.push({
            ...result,
            source: 'business_directory'
          });
        }

        locationData.companies.push(...companies);
        bar.tick();
        
        // Be respectful with delays
        await this.delay(1000);
        
      } catch (error) {
        console.log(chalk.red(`  ❌ Error processing keyword "${keyword}": ${error.message}`));
        bar.tick();
      }
    }

    // Save location data
    await fs.writeJson(`./output/raw/${location.replace(/\s+/g, '_')}_${county.replace(/\s+/g, '_')}.json`, locationData, { spaces: 2 });
    
    console.log(chalk.green(`  ✅ Scraped ${locationData.companies.length} companies from ${location}`));
    
    return locationData;
  }

  async scrapeAllLocations() {
    console.log(chalk.blue('\n🌍 Starting comprehensive UK garden office company scraping...'));
    
    const allCompanies = [];
    let totalLocations = 0;
    let processedLocations = 0;

    // Count total locations
    for (const country in ukLocations) {
      for (const county in ukLocations[country]) {
        totalLocations += ukLocations[country][county].length;
      }
    }

    const mainBar = new ProgressBar('Overall Progress [:bar] :current/:total locations', {
      complete: '=',
      incomplete: ' ',
      width: 50,
      total: totalLocations
    });

    for (const country in ukLocations) {
      console.log(chalk.magenta(`\n🏴 Scraping ${country}...`));
      
      for (const county in ukLocations[country]) {
        console.log(chalk.blue(`\n📊 Scraping ${county} county...`));
        
        for (const location of ukLocations[country][county]) {
          try {
            const locationData = await this.scrapeLocation(location, county);
            allCompanies.push(...locationData.companies);
            processedLocations++;
            mainBar.tick();
            
            // Save progress every 10 locations
            if (processedLocations % 10 === 0) {
              await this.saveProgress(allCompanies);
            }
            
          } catch (error) {
            console.log(chalk.red(`❌ Error scraping ${location}: ${error.message}`));
            processedLocations++;
            mainBar.tick();
          }
        }
      }
    }

    // Final save
    await this.saveProgress(allCompanies);
    
    console.log(chalk.green(`\n🎉 Scraping completed! Found ${allCompanies.length} companies across ${processedLocations} locations`));
    
    return allCompanies;
  }

  async saveProgress(companies) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await fs.writeJson(`./output/processed/all_companies_${timestamp}.json`, companies, { spaces: 2 });
    
    // Also save a current version
    await fs.writeJson('./output/processed/all_companies_current.json', companies, { spaces: 2 });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
    console.log(chalk.blue('🧹 Cleanup completed'));
  }
}

// Main execution function
async function main() {
  const scraper = new GardenOfficeScraper();
  
  try {
    await scraper.initialize();
    const companies = await scraper.scrapeAllLocations();
    
    console.log(chalk.green(`\n📊 Final Results:`));
    console.log(chalk.green(`Total companies found: ${companies.length}`));
    console.log(chalk.green(`Data saved to: ./output/processed/all_companies_current.json`));
    
  } catch (error) {
    console.error(chalk.red('❌ Fatal error:'), error);
  } finally {
    await scraper.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = GardenOfficeScraper;



