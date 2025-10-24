const fs = require('fs-extra');
const chalk = require('chalk');
const axios = require('axios');

class DataValidator {
  constructor() {
    this.validationResults = {
      valid: [],
      invalid: [],
      warnings: [],
      stats: {
        total: 0,
        valid: 0,
        invalid: 0,
        warnings: 0
      }
    };
  }

  async loadCleanedData() {
    console.log(chalk.blue('📂 Loading cleaned data...'));
    
    try {
      const data = await fs.readJson('./output/processed/cleaned_companies_current.json');
      console.log(chalk.green(`✅ Loaded ${data.length} companies`));
      return data;
    } catch (error) {
      console.log(chalk.red(`❌ Error loading cleaned data: ${error.message}`));
      return [];
    }
  }

  async validateCompany(company) {
    const validation = {
      company: company,
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validate name
    if (!company.name || company.name.length < 2) {
      validation.errors.push('Invalid or missing company name');
      validation.isValid = false;
    }

    // Validate slug
    if (!company.slug || company.slug.length < 2) {
      validation.errors.push('Invalid or missing company slug');
      validation.isValid = false;
    }

    // Validate contact information
    const hasContact = company.phone || company.email || company.website;
    if (!hasContact) {
      validation.errors.push('Missing contact information (phone, email, or website)');
      validation.isValid = false;
    }

    // Validate phone number
    if (company.phone && !this.validatePhone(company.phone)) {
      validation.warnings.push('Invalid phone number format');
    }

    // Validate email
    if (company.email && !this.validateEmail(company.email)) {
      validation.warnings.push('Invalid email format');
    }

    // Validate website
    if (company.website && !this.validateWebsite(company.website)) {
      validation.warnings.push('Invalid website URL');
    }

    // Validate location
    if (!company.city && !company.county) {
      validation.errors.push('Missing location information');
      validation.isValid = false;
    }

    // Validate postcode
    if (company.postcode && !this.validatePostcode(company.postcode)) {
      validation.warnings.push('Invalid UK postcode format');
    }

    // Validate services
    if (!company.services || !Array.isArray(company.services) || company.services.length === 0) {
      validation.warnings.push('No services specified');
    }

    return validation;
  }

  validatePhone(phone) {
    // UK phone number validation
    const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  }

  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateWebsite(website) {
    try {
      const url = new URL(website);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  validatePostcode(postcode) {
    // UK postcode validation
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;
    return postcodeRegex.test(postcode);
  }

  async checkWebsiteAccessibility(website) {
    try {
      const response = await axios.head(website, { timeout: 5000 });
      return response.status >= 200 && response.status < 400;
    } catch {
      return false;
    }
  }

  async validateCompanies() {
    console.log(chalk.blue('🔍 Starting company validation...'));
    
    const companies = await this.loadCleanedData();
    
    if (companies.length === 0) {
      console.log(chalk.yellow('⚠️  No companies to validate'));
      return;
    }

    this.validationResults.stats.total = companies.length;
    
    const bar = new ProgressBar('Validating [:bar] :current/:total', {
      complete: '=',
      incomplete: ' ',
      width: 40,
      total: companies.length
    });

    for (const company of companies) {
      try {
        const validation = await this.validateCompany(company);
        
        if (validation.isValid) {
          this.validationResults.valid.push(validation);
          this.validationResults.stats.valid++;
        } else {
          this.validationResults.invalid.push(validation);
          this.validationResults.stats.invalid++;
        }
        
        if (validation.warnings.length > 0) {
          this.validationResults.warnings.push(validation);
          this.validationResults.stats.warnings++;
        }
        
        bar.tick();
        
      } catch (error) {
        console.log(chalk.red(`❌ Error validating company ${company.name}: ${error.message}`));
      }
    }

    await this.saveValidationResults();
    this.printValidationSummary();
  }

  async saveValidationResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    // Save validation results
    await fs.writeJson(`./output/processed/validation_results_${timestamp}.json`, this.validationResults, { spaces: 2 });
    
    // Save valid companies
    const validCompanies = this.validationResults.valid.map(v => v.company);
    await fs.writeJson(`./output/processed/valid_companies_${timestamp}.json`, validCompanies, { spaces: 2 });
    await fs.writeJson('./output/processed/valid_companies_current.json', validCompanies, { spaces: 2 });
    
    // Save invalid companies
    if (this.validationResults.invalid.length > 0) {
      await fs.writeJson(`./output/processed/invalid_companies_${timestamp}.json`, this.validationResults.invalid, { spaces: 2 });
    }
    
    // Save warnings
    if (this.validationResults.warnings.length > 0) {
      await fs.writeJson(`./output/processed/validation_warnings_${timestamp}.json`, this.validationResults.warnings, { spaces: 2 });
    }
    
    console.log(chalk.green(`💾 Validation results saved to ./output/processed/`));
  }

  printValidationSummary() {
    console.log(chalk.blue('\n📊 Validation Summary:'));
    console.log(chalk.green(`✅ Valid companies: ${this.validationResults.stats.valid}`));
    console.log(chalk.red(`❌ Invalid companies: ${this.validationResults.stats.invalid}`));
    console.log(chalk.yellow(`⚠️  Companies with warnings: ${this.validationResults.stats.warnings}`));
    
    const successRate = (this.validationResults.stats.valid / this.validationResults.stats.total * 100).toFixed(2);
    console.log(chalk.blue(`📈 Success rate: ${successRate}%`));
    
    if (this.validationResults.stats.invalid > 0) {
      console.log(chalk.red('\n❌ Common validation errors:'));
      const errorCounts = {};
      
      for (const invalid of this.validationResults.invalid) {
        for (const error of invalid.errors) {
          errorCounts[error] = (errorCounts[error] || 0) + 1;
        }
      }
      
      const sortedErrors = Object.entries(errorCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      for (const [error, count] of sortedErrors) {
        console.log(chalk.red(`  - ${error}: ${count} companies`));
      }
    }
    
    if (this.validationResults.stats.warnings > 0) {
      console.log(chalk.yellow('\n⚠️  Common validation warnings:'));
      const warningCounts = {};
      
      for (const warning of this.validationResults.warnings) {
        for (const warn of warning.warnings) {
          warningCounts[warn] = (warningCounts[warn] || 0) + 1;
        }
      }
      
      const sortedWarnings = Object.entries(warningCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
      
      for (const [warn, count] of sortedWarnings) {
        console.log(chalk.yellow(`  - ${warn}: ${count} companies`));
      }
    }
  }

  async generateValidationReport() {
    console.log(chalk.blue('📊 Generating validation report...'));
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.validationResults.stats,
      recommendations: this.generateRecommendations(),
      dataQuality: this.calculateDataQuality()
    };
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await fs.writeJson(`./output/processed/validation_report_${timestamp}.json`, report, { spaces: 2 });
    
    console.log(chalk.green(`📊 Validation report saved`));
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.validationResults.stats.invalid > 0) {
      recommendations.push('Review and fix invalid company entries');
    }
    
    if (this.validationResults.stats.warnings > 0) {
      recommendations.push('Address validation warnings to improve data quality');
    }
    
    if (this.validationResults.stats.valid < this.validationResults.stats.total * 0.8) {
      recommendations.push('Consider improving data collection process');
    }
    
    return recommendations;
  }

  calculateDataQuality() {
    const total = this.validationResults.stats.total;
    const valid = this.validationResults.stats.valid;
    const warnings = this.validationResults.stats.warnings;
    
    return {
      overall: (valid / total * 100).toFixed(2) + '%',
      completeness: ((total - this.validationResults.stats.invalid) / total * 100).toFixed(2) + '%',
      accuracy: ((valid - warnings) / total * 100).toFixed(2) + '%'
    };
  }
}

// Main execution function
async function main() {
  const validator = new DataValidator();
  
  try {
    await validator.validateCompanies();
    await validator.generateValidationReport();
  } catch (error) {
    console.error(chalk.red('❌ Fatal error:'), error);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = DataValidator;



