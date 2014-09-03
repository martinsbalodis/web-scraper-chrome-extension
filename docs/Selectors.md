# Selectors

Web scraper has multiple selectors that can be used for different type data
extraction and for different interaction with the website. The selectors can
be divided in three groups:

 * Data extraction selectors for data extraction.
 * Link selectors for site navigation.
 * Element selectors for element selection that separate multiple records

### Data extraction selectors

Data extraction selectors simply return data from the element that it is
selected. For example [Text selector] [text-selector] extracts text from
elected element. These selectors can be used as text selectors:

 * [Text selector] [text-selector]
 * [Link selector] [link-selector]
 * [Link popup selector] [link-popup-selector]
 * [Image selector] [image-selector]
 * [Element attribute selector] [element-attribute-selector]
 * [Table selector] [table-selector]
 * [Grouped selector] [grouped-selector]
 * [HTML selector] [html-selector]

### Link selectors

Link selectors extract URLs from links that can be later opened for data
extraction. For example if in a sitemap tree there is a link selector that has
3 child text selectors then the Web Scraper extract all urls with the link
selector and then open each link and use those child data extraction selectors
to extract data. Of course a link selector might have link selectors as child
selectors then these child link selectors would be used for further page
navigation. These are currently available link selectors:

 * [Link selector] [link-selector]
 * [Link popup selector] [link-popup-selector]

### Element selectors

Element selectors are for element selection that contain multiple data elements.
For example element selector might be used to select a list of items in an
e-commerce site. The selector will return each selected element as a parent
element to its child selectors. Element selectors child selectors will
extracting data only within the element that the element selector gave them.
These are currently available Element selectors:

 * [Element selector] [element-selector]
 * [Element click selector] [element-click-selector]
 * [Element scroll selector] [element-scroll-selector]

## Selector configuration options

These are

 * selector - CSS selector that selects an element the selector will be working
 on.
 * multiple - should be checked when multiple records (data rows) are going to
 be extracted with this selector. Two mu
 * delay - delay before selector is being used.
 * parent selectors - configure parent selectors for this selector to make up the
selector tree.

Note! A common mistake when using multiple configuration option is to create
two selectors alongside with multiple checked and expect that the scraper will
join selector values in pairs. For example if you selected pagination links and
navigation links these links couldn't be logically joined in pairs. The correct
way is to select a wrapper element with Element selector and add data selectors
as child selectors to the element selector with multiple option not checked.

 [text-selector]: Selectors/Text%20selector.md
 [link-selector]: Selectors/Link%20Selector.md
 [link-popup-selector]: Selectors/Link%20Popup%20Selector.md
 [image-selector]: Selectors/Image%20selector.md
 [element-attribute-selector]: Selectors/Table%20selector.md
 [table-selector]: Selectors/Table%20selector.md
 [grouped-selector]: Selectors/Grouped%20selector.md
 [html-selector]: Selectors/HTML%20selector.md
 [element-selector]: Selectors/Element%20selector.md
 [element-click-selector]: Selectors/Element%20click%20selector.md
 [element-scroll-selector]: Selectors/Element%20scroll%20selector.md

