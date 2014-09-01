# Selectors

Web scraper has multiple selectors. Using these selectors you are a selector
tree that will be used for site navigation and data extraction. There are three
types of selectors:

 * Data extraction selectors for data extraction
 * Link selectors for site navigation
 * Element selectors for ????????

### Data exrtaction selectors

Data extraction selectors simply return data from the element that it is selecting.

### Link selectors

Link selectors extract URLs from links that can be later opened for data
extraction. For example if in a sitemap tree there is a link selector that has
3 child text selectors then the Web Scraper extract all urls with the link
selector and then open each link and use those child data extraction selectors
to extract data. Of course a link selector might have link selectors as child
selectors then these child link selectors would be used for further page
navigation.

### Element selectors


# Selector configuration options

Every selector has configuration options that configres what element the selector will