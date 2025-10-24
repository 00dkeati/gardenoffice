#!/usr/bin/env node

const chalk = require('chalk');
const GardenOfficeScraper = require('./src/scraper');
const DataCleaner = require('./src/dataCleaner');
const DataValidator = require('./src/dataValidator');
const DirectoryIntegrator = require('./src/integrateWithDirectory');

async function main() {
  console.log(chalk.blue('🚀 Garden Office Company Scraper'));
  console.log(chalk.blue('================================\n'));

  const command = process.argv[2];

  switch (command) {
    case 'scrape':
      await runScraping();
      break;
    case 'clean':
      await runCleaning();
      break;
    case 'validate':
      await runValidation();
      break;
    case 'integrate':
      await runIntegration();
      break;
    case 'full':
      await runFullCycle();
      break;
    default:
      showHelp();
  }
}

async function runScraping() {
  console.log(chalk.blue('📡 Starting scraping process...'));
  
  const scraper = new GardenOfficeScraper();
  
  try {
    await scraper.initialize();
    const companies = await scraper.scrapeAllLocations();
    await scraper.cleanup();
    
    console.log(chalk.green(`✅ Scraping completed! Found ${companies.length} companies`));
  } catch (error) {
    console.error(chalk.red('❌ Scraping failed:'), error);
  }
}

async function runCleaning() {
  console.log(chalk.blue('🧹 Starting data cleaning...'));
  
  const cleaner = new DataCleaner();
  
  try {
    await cleaner.cleanData();
    console.log(chalk.green('✅ Data cleaning completed!'));
  } catch (error) {
    console.error(chalk.red('❌ Data cleaning failed:'), error);
  }
}

async function runValidation() {
  console.log(chalk.blue('✅ Starting data validation...'));
  
  const validator = new DataValidator();
  
  try {
    await validator.validateCompanies();
    console.log(chalk.green('✅ Data validation completed!'));
  } catch (error) {
    console.error(chalk.red('❌ Data validation failed:'), error);
  }
}

async function runIntegration() {
  console.log(chalk.blue('🔗 Starting database integration...'));
  
  const integrator = new DirectoryIntegrator();
  
  try {
    await integrator.integrateWithDatabase();
    await integrator.generateIntegrationReport();
    console.log(chalk.green('✅ Database integration completed!'));
  } catch (error) {
    console.error(chalk.red('❌ Database integration failed:'), error);
  } finally {
    await integrator.cleanup();
  }
}

async function runFullCycle() {
  console.log(chalk.blue('🔄 Running full scraping cycle...'));
  
  try {
    // Step 1: Scrape
    await runScraping();
    
    // Step 2: Clean
    await runCleaning();
    
    // Step 3: Validate
    await runValidation();
    
    // Step 4: Integrate
    await runIntegration();
    
    console.log(chalk.green('🎉 Full cycle completed successfully!'));
  } catch (error) {
    console.error(chalk.red('❌ Full cycle failed:'), error);
  }
}

function showHelp() {
  console.log(chalk.blue('Usage: node index.js <command>\n'));
  console.log(chalk.blue('Commands:'));
  console.log(chalk.blue('  scrape     - Scrape garden office companies'));
  console.log(chalk.blue('  clean      - Clean and deduplicate scraped data'));
  console.log(chalk.blue('  validate   - Validate cleaned data'));
  console.log(chalk.blue('  integrate  - Integrate data with directory database'));
  console.log(chalk.blue('  full       - Run complete scraping cycle'));
  console.log(chalk.blue('  help       - Show this help message\n'));
  console.log(chalk.blue('Examples:'));
  console.log(chalk.blue('  node index.js scrape'));
  console.log(chalk.blue('  node index.js full'));
  console.log(chalk.blue('\nFor more information, see README.md'));
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}



