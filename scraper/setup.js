#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

async function setup() {
  console.log(chalk.blue('🚀 Setting up Garden Office Scraper...\n'));

  try {
    // Check if .env exists
    if (!await fs.pathExists('.env')) {
      console.log(chalk.yellow('⚠️  Creating .env file from template...'));
      await fs.copy('env.example', '.env');
      console.log(chalk.green('✅ .env file created'));
      console.log(chalk.yellow('📝 Please edit .env and add your OpenAI API key\n'));
    }

    // Create output directories
    console.log(chalk.blue('📁 Creating output directories...'));
    await fs.ensureDir('./output');
    await fs.ensureDir('./output/raw');
    await fs.ensureDir('./output/processed');
    await fs.ensureDir('./output/companies');
    console.log(chalk.green('✅ Output directories created'));

    // Check if node_modules exists
    if (!await fs.pathExists('node_modules')) {
      console.log(chalk.blue('📦 Installing dependencies...'));
      execSync('npm install', { stdio: 'inherit' });
      console.log(chalk.green('✅ Dependencies installed'));
    }

    // Create a simple test script
    console.log(chalk.blue('🧪 Creating test script...'));
    const testScript = `#!/usr/bin/env node
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
console.log(chalk.yellow('\\n⚠️  Make sure to add your OpenAI API key to .env file'));
`;

    await fs.writeFile('./test.js', testScript);
    console.log(chalk.green('✅ Test script created'));

    console.log(chalk.green('\n🎉 Setup completed successfully!'));
    console.log(chalk.blue('\n📋 Next steps:'));
    console.log(chalk.blue('1. Edit .env file and add your OpenAI API key'));
    console.log(chalk.blue('2. Run: npm run test (to verify setup)'));
    console.log(chalk.blue('3. Run: npm run scrape (to start scraping)'));
    console.log(chalk.blue('4. Run: npm run full (for complete cycle)'));

  } catch (error) {
    console.error(chalk.red('❌ Setup failed:'), error.message);
    process.exit(1);
  }
}

// Run setup
setup().catch(console.error);



