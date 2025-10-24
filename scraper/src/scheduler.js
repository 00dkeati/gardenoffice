const cron = require('node-cron');
const chalk = require('chalk');
const GardenOfficeScraper = require('./scraper');
const DataCleaner = require('./dataCleaner');
const DataValidator = require('./dataValidator');

class ScrapingScheduler {
  constructor() {
    this.scraper = new GardenOfficeScraper();
    this.cleaner = new DataCleaner();
    this.validator = new DataValidator();
    this.isRunning = false;
  }

  async runFullScrapingCycle() {
    if (this.isRunning) {
      console.log(chalk.yellow('⚠️  Scraping cycle already running, skipping...'));
      return;
    }

    this.isRunning = true;
    const startTime = new Date();
    
    console.log(chalk.blue(`🚀 Starting full scraping cycle at ${startTime.toISOString()}`));
    
    try {
      // Step 1: Scrape new data
      console.log(chalk.blue('\n📡 Step 1: Scraping new data...'));
      await this.scraper.initialize();
      const companies = await this.scraper.scrapeAllLocations();
      await this.scraper.cleanup();
      
      // Step 2: Clean data
      console.log(chalk.blue('\n🧹 Step 2: Cleaning data...'));
      await this.cleaner.cleanData();
      
      // Step 3: Validate data
      console.log(chalk.blue('\n✅ Step 3: Validating data...'));
      await this.validator.validateCompanies();
      
      const endTime = new Date();
      const duration = (endTime - startTime) / 1000 / 60; // minutes
      
      console.log(chalk.green(`\n🎉 Full scraping cycle completed in ${duration.toFixed(2)} minutes`));
      
    } catch (error) {
      console.error(chalk.red('❌ Error during scraping cycle:'), error);
    } finally {
      this.isRunning = false;
    }
  }

  async runIncrementalScraping() {
    if (this.isRunning) {
      console.log(chalk.yellow('⚠️  Incremental scraping already running, skipping...'));
      return;
    }

    this.isRunning = true;
    const startTime = new Date();
    
    console.log(chalk.blue(`🔄 Starting incremental scraping at ${startTime.toISOString()}`));
    
    try {
      // Only scrape a subset of locations for incremental updates
      const incrementalLocations = this.getIncrementalLocations();
      
      await this.scraper.initialize();
      
      for (const location of incrementalLocations) {
        await this.scraper.scrapeLocation(location.location, location.county);
      }
      
      await this.scraper.cleanup();
      
      // Clean and validate only new data
      await this.cleaner.cleanData();
      await this.validator.validateCompanies();
      
      const endTime = new Date();
      const duration = (endTime - startTime) / 1000 / 60;
      
      console.log(chalk.green(`\n✅ Incremental scraping completed in ${duration.toFixed(2)} minutes`));
      
    } catch (error) {
      console.error(chalk.red('❌ Error during incremental scraping:'), error);
    } finally {
      this.isRunning = false;
    }
  }

  getIncrementalLocations() {
    // Return a subset of locations for incremental updates
    // This could be based on last update time, priority, etc.
    const { ukLocations } = require('./config/uk-locations');
    
    const locations = [];
    let count = 0;
    const maxLocations = 50; // Limit incremental scraping to 50 locations
    
    for (const country in ukLocations) {
      for (const county in ukLocations[country]) {
        for (const location of ukLocations[country][county]) {
          if (count >= maxLocations) break;
          
          locations.push({ location, county, country });
          count++;
        }
        if (count >= maxLocations) break;
      }
      if (count >= maxLocations) break;
    }
    
    return locations;
  }

  startScheduler() {
    console.log(chalk.blue('⏰ Starting scraping scheduler...'));
    
    // Full scraping cycle every Sunday at 2 AM
    cron.schedule('0 2 * * 0', () => {
      console.log(chalk.blue('📅 Scheduled full scraping cycle starting...'));
      this.runFullScrapingCycle();
    });
    
    // Incremental scraping every day at 6 AM
    cron.schedule('0 6 * * *', () => {
      console.log(chalk.blue('📅 Scheduled incremental scraping starting...'));
      this.runIncrementalScraping();
    });
    
    // Data cleaning and validation every day at 8 AM
    cron.schedule('0 8 * * *', () => {
      console.log(chalk.blue('📅 Scheduled data cleaning and validation starting...'));
      this.runDataMaintenance();
    });
    
    console.log(chalk.green('✅ Scheduler started with the following schedule:'));
    console.log(chalk.green('  - Full scraping: Every Sunday at 2:00 AM'));
    console.log(chalk.green('  - Incremental scraping: Every day at 6:00 AM'));
    console.log(chalk.green('  - Data maintenance: Every day at 8:00 AM'));
  }

  async runDataMaintenance() {
    console.log(chalk.blue('🔧 Running data maintenance...'));
    
    try {
      await this.cleaner.cleanData();
      await this.validator.validateCompanies();
      
      console.log(chalk.green('✅ Data maintenance completed'));
      
    } catch (error) {
      console.error(chalk.red('❌ Error during data maintenance:'), error);
    }
  }

  async runOnce() {
    console.log(chalk.blue('🚀 Running scraping cycle once...'));
    await this.runFullScrapingCycle();
  }

  async runIncrementalOnce() {
    console.log(chalk.blue('🔄 Running incremental scraping once...'));
    await this.runIncrementalScraping();
  }

  async runMaintenanceOnce() {
    console.log(chalk.blue('🔧 Running data maintenance once...'));
    await this.runDataMaintenance();
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      lastRun: this.lastRun,
      nextRun: this.getNextRun()
    };
  }

  getNextRun() {
    // Calculate next run times for scheduled tasks
    const now = new Date();
    const nextFull = this.getNextSunday(now);
    const nextIncremental = this.getNextDay(now);
    const nextMaintenance = this.getNextMaintenance(now);
    
    return {
      fullScraping: nextFull,
      incrementalScraping: nextIncremental,
      dataMaintenance: nextMaintenance
    };
  }

  getNextSunday(date) {
    const nextSunday = new Date(date);
    nextSunday.setDate(date.getDate() + (7 - date.getDay()));
    nextSunday.setHours(2, 0, 0, 0);
    
    if (nextSunday <= date) {
      nextSunday.setDate(nextSunday.getDate() + 7);
    }
    
    return nextSunday;
  }

  getNextDay(date) {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    nextDay.setHours(6, 0, 0, 0);
    
    return nextDay;
  }

  getNextMaintenance(date) {
    const nextMaintenance = new Date(date);
    nextMaintenance.setDate(date.getDate() + 1);
    nextMaintenance.setHours(8, 0, 0, 0);
    
    return nextMaintenance;
  }
}

// Command line interface
async function main() {
  const scheduler = new ScrapingScheduler();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      scheduler.startScheduler();
      break;
      
    case 'run-once':
      await scheduler.runOnce();
      break;
      
    case 'run-incremental':
      await scheduler.runIncrementalOnce();
      break;
      
    case 'run-maintenance':
      await scheduler.runMaintenanceOnce();
      break;
      
    case 'status':
      const status = scheduler.getStatus();
      console.log(chalk.blue('📊 Scheduler Status:'));
      console.log(chalk.blue(`  Running: ${status.isRunning}`));
      console.log(chalk.blue(`  Last Run: ${status.lastRun || 'Never'}`));
      console.log(chalk.blue('  Next Runs:'));
      console.log(chalk.blue(`    Full Scraping: ${status.nextRun.fullScraping.toISOString()}`));
      console.log(chalk.blue(`    Incremental: ${status.nextRun.incrementalScraping.toISOString()}`));
      console.log(chalk.blue(`    Maintenance: ${status.nextRun.dataMaintenance.toISOString()}`));
      break;
      
    default:
      console.log(chalk.blue('Usage:'));
      console.log(chalk.blue('  node scheduler.js start              - Start the scheduler'));
      console.log(chalk.blue('  node scheduler.js run-once          - Run full scraping once'));
      console.log(chalk.blue('  node scheduler.js run-incremental   - Run incremental scraping once'));
      console.log(chalk.blue('  node scheduler.js run-maintenance   - Run data maintenance once'));
      console.log(chalk.blue('  node scheduler.js status            - Show scheduler status'));
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ScrapingScheduler;



