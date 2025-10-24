#!/usr/bin/env node
const chalk = require('chalk');

console.log(chalk.green('✅ Garden Office Scraper is ready!'));
console.log(chalk.blue('📋 Available commands:'));
console.log(chalk.blue('  npm run scrape     - Scrape garden office companies'));
console.log(chalk.blue('  npm run clean      - Clean scraped data'));
console.log(chalk.blue('  npm run validate   - Validate data'));
console.log(chalk.blue('  npm run integrate  - Integrate with database'));
console.log(chalk.blue('  npm run full       - Run complete cycle'));
console.log(chalk.blue('  npm run schedule   - Start scheduler'));
console.log(chalk.blue('  npm run help       - Show help'));
console.log(chalk.yellow('\n⚠️  Make sure to add your OpenAI API key to .env file'));
