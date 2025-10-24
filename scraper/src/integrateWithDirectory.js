const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const ProgressBar = require('progress');
const { PrismaClient } = require('@prisma/client');

class DirectoryIntegrator {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async loadScrapedData() {
    console.log(chalk.blue('📂 Loading scraped company data...'));
    
    try {
      const data = await fs.readJson('./output/processed/cleaned_companies_current.json');
      console.log(chalk.green(`✅ Loaded ${data.length} valid companies`));
      return data;
    } catch (error) {
      console.log(chalk.red(`❌ Error loading scraped data: ${error.message}`));
      return [];
    }
  }

  async integrateWithDatabase() {
    console.log(chalk.blue('🔗 Integrating scraped data with directory database...'));
    
    const companies = await this.loadScrapedData();
    
    if (companies.length === 0) {
      console.log(chalk.yellow('⚠️  No companies to integrate'));
      return;
    }

    let integrated = 0;
    let skipped = 0;
    let errors = 0;

    const bar = new ProgressBar('Integrating [:bar] :current/:total', {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: companies.length
    });

    for (const company of companies) {
      try {
        // Check if company already exists
        const existing = await this.prisma.company.findUnique({
          where: { slug: company.slug }
        });

        if (existing) {
          // Update existing company
          await this.prisma.company.update({
            where: { slug: company.slug },
            data: this.prepareCompanyData(company)
          });
          skipped++;
        } else {
          // Create new company
          await this.prisma.company.create({
            data: this.prepareCompanyData(company)
          });
          integrated++;
        }

        bar.tick();

      } catch (error) {
        console.log(chalk.red(`❌ Error integrating company ${company.name}: ${error.message}`));
        errors++;
        bar.tick();
      }
    }

    console.log(chalk.green(`\n🎉 Integration completed!`));
    console.log(chalk.green(`  - New companies: ${integrated}`));
    console.log(chalk.green(`  - Updated companies: ${skipped}`));
    console.log(chalk.green(`  - Errors: ${errors}`));
  }

  prepareCompanyData(company) {
    return {
      name: company.name,
      slug: company.slug,
      description: company.description,
      website: company.website,
      phone: company.phone,
      email: company.email,
      address: company.address,
      city: company.city,
      county: company.county,
      postcode: company.postcode,
      services: company.services,
      verified: company.verified || false,
      featured: company.featured || false,
      active: company.active || true,
      metaTitle: company.metaTitle,
      metaDescription: company.metaDescription
    };
  }

  async generateIntegrationReport() {
    console.log(chalk.blue('📊 Generating integration report...'));
    
    const totalCompanies = await this.prisma.company.count();
    const verifiedCompanies = await this.prisma.company.count({
      where: { verified: true }
    });
    const featuredCompanies = await this.prisma.company.count({
      where: { featured: true }
    });
    const activeCompanies = await this.prisma.company.count({
      where: { active: true }
    });

    const report = {
      timestamp: new Date().toISOString(),
      totalCompanies,
      verifiedCompanies,
      featuredCompanies,
      activeCompanies,
      verificationRate: ((verifiedCompanies / totalCompanies) * 100).toFixed(2) + '%',
      featuredRate: ((featuredCompanies / totalCompanies) * 100).toFixed(2) + '%',
      activeRate: ((activeCompanies / totalCompanies) * 100).toFixed(2) + '%'
    };

    await fs.writeJson('./output/processed/integration_report.json', report, { spaces: 2 });
    
    console.log(chalk.green('📊 Integration report saved'));
    console.log(chalk.blue('📈 Directory Statistics:'));
    console.log(chalk.blue(`  - Total companies: ${totalCompanies}`));
    console.log(chalk.blue(`  - Verified companies: ${verifiedCompanies} (${report.verificationRate})`));
    console.log(chalk.blue(`  - Featured companies: ${featuredCompanies} (${report.featuredRate})`));
    console.log(chalk.blue(`  - Active companies: ${activeCompanies} (${report.activeRate})`));
  }

  async cleanup() {
    await this.prisma.$disconnect();
  }
}

// Main execution function
async function main() {
  const integrator = new DirectoryIntegrator();
  
  try {
    await integrator.integrateWithDatabase();
    await integrator.generateIntegrationReport();
  } catch (error) {
    console.error(chalk.red('❌ Fatal error:'), error);
  } finally {
    await integrator.cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DirectoryIntegrator;


