# Scraping a site

Open the site that you want to scrape.

## Create Sitemap

The first thing you need to do when creating a *sitemap* is specifying the
start url. This is the url from which the scraping will start. You can also
specify multiple start urls if the scraping should start from multiple places.
For example if you want to scrape multiple search results then you could create
a separate start url for each search result.

### Specify multiple urls with ranges

In cases where a site uses numbering in pages URLs it is much simpler to create
a range start url than creating *Link selectors* that would navigate the site.
To specify a range url replace the numeric part of start url with a range
definition - `[1-100]`. If the site uses zero padding in urls then add zero
padding to the range definition - `[001-100]`. If you want to skip some urls
then you can also specify incremental like this `[0-100:10]`.

Use range url like this `http://example.com/page/[1-3]` for links like these:

 * `http://example.com/page/1`
 * `http://example.com/page/2`
 * `http://example.com/page/3`

Use range url with zero padding like this `http://example.com/page/[001-100]`
for links like these:

 * `http://example.com/page/001`
 * `http://example.com/page/002`
 * `http://example.com/page/003`

Use range url with increment like this `http://example.com/page/[0-100:10]` for
links like these:

 * `http://example.com/page/0`
 * `http://example.com/page/10`
 * `http://example.com/page/20`

## Create selectors

After you have created the *sitemap* you can add selectors to it. In the
*Selectors* panel you can add new selectors, modify them and navigate the
selector tree.
The selectors can be added in a tree type structure. The web scraper will
execute the selectors in the order how they are organized in the tree
structure. For example there is a news site and you want to scrape all articles
whose links are available on the first page. In image 1 you can see this
example site.

![Fig. 1: News site][image-news-site]

To scrape this site you can create a *Link selector* which will extract all
article links in the first page. Then as a child selector you can add a
*Text selector* that will extract articles from the article pages that the
*Link selector* found links to. Image below illustrates how the *sitemap*
should be built for the news site.

![Fig. 2: News site sitemap][image-news-site-sitemap]

Note that when creating selectors use Element preview and Data preview features
to ensure that you have selected the correct elements with the correct data.

### Inspect selector tree

After you have created selectors for the *sitemap* you can inspect the tree
structure of selectors in the Selector graph panel. Image below shows an
example selector graph.

![Fig. 3: News site selector graph][image-news-site-selector-graph]

## Scrape the site

After you have created selectors for the *sitemap* you can start scraping. Open
*Scrape* panel and start scraping. A new popup window will open in which the
scraper will load pages and extract data from them. After the scraping is done
the popup window will close and you will receive a popup message. You can view
the scraped data by opening *Browse* panel and export it by opening the
*Export data as CSV panel*.


[image-news-site]: images/scraping-a-site/news-site.png?raw=true
[image-news-site-sitemap]: images/scraping-a-site/news-site-sitemap.png?raw=true
[image-news-site-selector-graph]: images/scraping-a-site/news-site-selector-graph.png?raw=true