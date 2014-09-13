# Web Scraper
Web Scraper is a chrome browser extension built for data extraction from web 
pages. Using this extension you can create a plan (sitemap) how a web site 
should be traversed and what should be extracted. Using these sitemaps the 
Web Scraper will navigate the site accordingly and extract all data. Scraped 
data later can be exported as CSV.

Install the extension from [Chrome store] [chrome-store]

### Features

 1. Scrape multiple pages
 2. Sitemaps and scraped data are stored in browsers local storage or in CouchDB
 3. Multiple data selection types
 4. Extract data from dynamic pages (JavaScript+AJAX)
 5. Browse scraped data
 6. Export scraped data as CSV
 7. Import, Export sitemaps
 8. Depends only on Chrome browser

### Help

 Documentation and tutorials are available on [webscraper.io] [webscraper.io]
 
 Ask for help, submit bugs, suggest features on [google groups] [google-groups]
 
 Submit bugs and suggest features on [bug tracker] [github-issues]
 
#### Bugs
When submitting a bug please attach an exported sitemap if possible.

## License
LGPLv3

## Changelog

### v0.2
 * Added Element click selector
 * Added Element scroll down selector
 * Added Link popup selector
 * Improved table selector to work with any html markup
 * Added Image download
 * Added keyboard shortcuts when selecting elements
 * Added configurable delay before using selector
 * Added configurable delay between page visiting
 * Added multiple start url configuration
 * Added form field validation
 * Fixed a lot of bugs

### v0.1.3
 * Added Table selector
 * Added HTML selector
 * Added HTML attribute selector
 * Added data preview
 * Added ranged start urls
 * Fixed bug which made selector tree not to show on some operating systems

 [chrome-store]: https://chrome.google.com/webstore/detail/web-scraper/jnhgnonknehpejjnehehllkliplmbmhn
 [webscraper.io]: http://webscraper.io/
 [google-groups]: https://groups.google.com/forum/#!forum/web-scraper
 [github-issues]: https://github.com/martinsbalodis/web-scraper-chrome-extension/issues
