# Garden Office Company Scraper

An AI-powered web scraping system designed to build a comprehensive directory of garden office companies across the UK by county and town.

## Features

- **AI-Powered Data Extraction**: Uses OpenAI GPT-4 to intelligently extract company information from web pages
- **Comprehensive Coverage**: Scrapes all UK counties and major towns/cities
- **Multiple Data Sources**: Searches Google, Bing, Yahoo, DuckDuckGo, and business directories
- **Data Cleaning & Validation**: Automated cleaning, deduplication, and validation of scraped data
- **Scheduled Scraping**: Automated scheduling for regular data updates
- **Progress Tracking**: Real-time progress bars and detailed logging
- **Error Handling**: Robust error handling with retry mechanisms

## Installation

1. **Clone and navigate to the scraper directory:**
   ```bash
   cd scraper
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

### Basic Scraping

```bash
# Run full scraping cycle
npm run scrape

# Clean scraped data
npm run clean

# Validate cleaned data
npm run validate
```

### Scheduled Scraping

```bash
# Start the scheduler
npm run schedule start

# Run scraping once
npm run schedule run-once

# Run incremental scraping
npm run schedule run-incremental

# Check scheduler status
npm run schedule status
```

### Individual Components

```bash
# Run scraper only
node src/scraper.js

# Run data cleaner only
node src/dataCleaner.js

# Run data validator only
node src/dataValidator.js

# Run scheduler
node src/scheduler.js
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key for AI-powered data extraction
- `SCRAPING_DELAY_MS`: Delay between requests (default: 1000ms)
- `MAX_CONCURRENT_REQUESTS`: Maximum concurrent requests (default: 5)
- `REQUEST_TIMEOUT_MS`: Request timeout (default: 30000ms)

### Location Configuration

The scraper uses a comprehensive list of UK locations in `src/config/uk-locations.js`:

- **England**: 47 counties with major towns and cities
- **Scotland**: 10 regions with major towns and cities  
- **Wales**: 8 counties with major towns and cities
- **Northern Ireland**: 7 counties with major towns and cities

### Keywords

The scraper targets 100+ garden office-related keywords including:
- garden office
- garden office pod
- garden office shed
- garden room
- garden building
- bespoke garden office
- insulated garden office
- And many more...

## Data Sources

### Search Engines
- Google
- Bing
- Yahoo
- DuckDuckGo

### Business Directories
- Yell
- Thomson Local
- Touch Local
- FreeIndex
- Hotfrog
- Cylex
- 192.com

## Output Structure

```
output/
├── raw/                          # Raw scraped data by location
│   ├── London_Greater_London.json
│   ├── Manchester_Greater_Manchester.json
│   └── ...
├── processed/                    # Processed and cleaned data
│   ├── cleaned_companies_current.json
│   ├── valid_companies_current.json
│   ├── duplicates_timestamp.json
│   ├── invalid_entries_timestamp.json
│   └── validation_results_timestamp.json
└── companies/                    # Individual company files
    ├── company-name-1.json
    ├── company-name-2.json
    └── ...
```

## Data Processing Pipeline

1. **Scraping**: Extract company information from multiple sources
2. **Cleaning**: Standardize data format, remove duplicates
3. **Validation**: Validate contact information, locations, services
4. **Enrichment**: Add metadata, generate slugs, categorize services

## AI-Powered Features

### Company Data Extraction
- Uses GPT-4 to intelligently extract company information from web pages
- Handles various website layouts and formats
- Extracts structured data from unstructured content

### Data Validation
- AI-powered validation of company information
- Intelligent duplicate detection
- Service categorization and mapping

## Scheduling

The scheduler runs three types of tasks:

- **Full Scraping**: Every Sunday at 2:00 AM (complete data refresh)
- **Incremental Scraping**: Every day at 6:00 AM (targeted updates)
- **Data Maintenance**: Every day at 8:00 AM (cleaning and validation)

## Monitoring

- Real-time progress tracking
- Detailed logging with colored output
- Error reporting and retry mechanisms
- Performance metrics and statistics

## Data Quality

### Validation Rules
- Company name validation
- Contact information validation (phone, email, website)
- Location validation (UK postcodes, cities, counties)
- Service categorization
- Duplicate detection

### Quality Metrics
- Success rate tracking
- Data completeness scoring
- Accuracy validation
- Cleanup statistics

## Error Handling

- Automatic retry mechanisms
- Graceful error handling
- Detailed error logging
- Fallback strategies

## Performance

- Rate limiting to respect website policies
- Concurrent request management
- Memory-efficient processing
- Progress tracking for long-running operations

## Security

- Respectful scraping practices
- User agent rotation
- Request delays and rate limiting
- No personal data collection

## Troubleshooting

### Common Issues

1. **OpenAI API Errors**
   - Check your API key in `.env`
   - Ensure you have sufficient API credits
   - Monitor rate limits

2. **Scraping Errors**
   - Check internet connection
   - Verify target websites are accessible
   - Adjust delay settings if needed

3. **Data Quality Issues**
   - Review validation reports
   - Check cleaning rules
   - Verify location data

### Debug Mode

Enable debug logging by setting `LOG_LEVEL=debug` in your `.env` file.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
- Check the troubleshooting section
- Review the logs in `output/processed/`
- Open an issue on GitHub

---

**Note**: This scraper is designed for educational and research purposes. Please ensure you comply with website terms of service and robots.txt files when scraping data.



