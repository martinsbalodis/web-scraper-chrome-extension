# Link selector

Link selector is used for link selection and website navigation. If you use
*Link selector* without any child selectors then it will extract the link and
the href attribute of the link. If you add child selectors to *Link selector*
then these child selectors will be used in the page that this link was leading
to. If you are selecting multiple links then check *multiple* property.

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



**Handle pagination**

