# Link selector

Link selector is used for link selection and website navigation. If you use
*Link selector* without any child selectors then it will extract the link and
the href attribute of the link. If you add child selectors to *Link selector*
then these child selectors will be used in the page that this link was leading
to. If you are selecting multiple links then check *multiple* property.

Note! Link selector works only with `<a>` tags with `href` attribute. If the
link selector is not working for you then you can try these workarounds:

 1. Check that the link in the url bar changes after clicking an item (changes
 only after hash tag doesn't count). If the link doesn't change then the site
 is probably using ajax for data loading. Instead of using link selector you
 should use [Element click selector] [element-click].
 2. If the site opens a popup then you should use
 [Link popup selector] [link-popup]
 3. The site might be using JavaScript `window.location` to change the URL. Web
 Scraper cannot handle this kind of navigation right now.

## Configuration options

 * selector - [CSS selector] [css-selector] for the link element from which the
 link for navigation will be extracted.
 * multiple - multiple records are being extracted. Usually should be checked.

## Use cases

**Navigate through multiple levels of navigation**

For example an e-commerce site has multi level navigation -
`categories -> subcategories`. To scrape data from all categories and
subcategories you can create two *Link selectors*. One selector would select
category links and the other selector would select subcategory links that are
available in the category pages. The subcategory *Link selector* should be made
as a child of the category *Link selector*. The selectors for data extraction
from subcategory pages should be made as a child selectors to the subcategory
selector.

![Fig. 1: Multiple link selectors for category navigation][multiple-level-link-selectors]

**Handle pagination**

For example an e-commerce site has multiple categories. Each category has a
list of items and pagination links. Also some pages are not directly available
from the category but are available from from pagination pages (you can see
pagination links 1-5, but not 6-8). You can start by building a sitemap that
visits each category and extract items from category page. This sitemap will
extract items only from the first pagination page. To extract items from all of
the pagination links including the ones that are not visible at the beginning
you need to create another *Link selector* that selects the pagination links.
Figure 2 shows how the link selector should bepagination-selector-graph created in the sitemap. When
the scraper opens a category link it will extract items that are available in
the page. After that it will find the pagination links and also visit those. If
the pagination link selector is made a child to itself it will recursively
discover all pagination pages. Figure 3 shows a selector graph where you can
see how pagination links discover more pagination links and more data.

![Fig. 2: Sitemap with Link selector for pagination][pagination-link-selectors]
![Fig. 3: Selector graph with pagination][pagination-selector-graph]

 [multiple-level-link-selectors]: ../images/selectors/link/multiple-level-link-selectors.png?raw=true
 [pagination-link-selectors]: ../images/selectors/link/pagination-link-selectors.png?raw=true
 [pagination-selector-graph]: ../images/selectors/link/pagination-selector-graph.png?raw=true
 [element-click]: selectors/element-click-selector.md
 [link-popup]: selectors/link-popup-selector.md
 [css-selector]: css-selector.md