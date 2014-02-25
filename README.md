# Web Scraper
Web Scraper is a chrome browser extension built for data extraction from web pages. Using this extension you can create a plan (sitemap) how a web site should be traversed and what should be extracted. Using these sitemaps the Web Scraper will navigate the site accordingly and extract all data. Scraped data later can be exported as CSV.

### Features

 1. Scrape multiple pages
 2. Sitemaps and scraped data are stored in browsers local storage or in CouchDB
 3. Multiple data selection types
 4. Browse scraped data
 5. Export scraped data as CSV
 6. Import, Export sitemaps
 7. Depends only on Chrome browser

## How to use it
Imagine an on-line store that is selling items you are interested in. These items are grouped by category and also there are only 10 items visible per page. The rest of the items are accessible via pagination.

To scrape this kind of a page you need to create a Sitemap which starts with the landing page. After that you can continue with selector tree creation. Start by creating Url selectors for navigation links and pagination links. Then create an Element selector for a list item. And after that create Text selectors the items descriptors. The resulting Sitemap should look like the one in the image below. When your Sitemap is done you can start scraping it.

![Selector tree][2]

## Selectors

There are different type of selectors for different type of data. Use this table to find a suited one for you. If there is not a selector that fits your needs, then you can try to create one. The scraper is built in a way that it is very easy to implement new selectors.

Selector          | Returned records | Returned data   | Can lead to new Jobs | Can have child selectors
---               | ---              | ---             | ---                  | ---
Text              | 1 or *           | text            | N                    | N
Element           | 1 or *           | None            | N                    | Y
Group             | 1                | JSON            | N                    | N
Link              | 1 or *           | text, url       | Y                    | Y
Image             | 1 or *           | image src       | N                    | N
HTML              | 1 or *           | html            | N                    | N
Element Attribute | 1 or *           | text            | N                    | N
Table             | 1 or *           | text            | N                    | N

### Text
Used for text selection. All HTML will be stripped and only text will be returned. You can additionaly apply regex to resulting data. Regex is applied before data export so you can change the regex after data is scraped. If a link element is selected then also its href wttribute will be returned, but the scraper will not follow the link.

### Element
This selector will not return any data. Use this selector select multiple elements and add child selectors within this selector.

### Group
Use Group selector to select multiple items. The resulting items data will be seerialized as JSON and stored within one record.

### Link
Use this selector to select links. The scraper will follow links and select data from each child page.

### Image
Use this selector to retrieve image src attribute. The image itself will not be stored as it cannot be exported as CSV.

### HTML
This selector will return html and text within the selected element.

### Element Attribute
This selector can extract an attribute of an html element. For example you might want to extract title attribute from this link: `<a href="#" title="my title">link<a>`.

### Table
This selector can extract data from tables. Table columns are used to split table rows into multiple values. Currently
table selector only works with tables which have a <thead> HTML tag. Please submit issues for other table types.

## Issues
Submit issues in issue tracker. Please attach an exported sitemap if possible.

## License
LGPLv3



  [1]: http://www.youtube.com/
  [2]: docs/images/sitemap-tree.png "sitemap-scraper.png"