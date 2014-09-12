# Element selector

Element selector is for element selection that contain multiple data elements.
For example element selector might be used to select a list of items in an
e-commerce site. The selector will return each selected element as a parent
element to its child selectors. Element selectors child selectors will be
extracting data only within the element that the element selector gave them.

Note! If the page dynamically loads new items after scrolling down or clicking
on a button then you should try these selectors:

 * [Element scroll down selector] [element-scroll-selector]
 * [Element click selector] [element-click-selector]

## Configuration options
 * selector - [CSS selector] [css-selector] for the wrapper elements that will
 be used as parent elements for child selectors.
 * multiple - multiple records are being extracted (almost always should be
 checked). Multiple option for child selectors usually should not be checked.

## Use cases

#### Select multiple e-commerce items from a page

For example an e-commerce site has a page with a list of items. With element
selector you can select the elements that wrap these items and then add
multiple child selectors to it to extract data within the items wrapper 
element. Figure 1 shows how an element selector could be used in this
situation.

![Fig. 1: Multiple items selected with element selector] [multiple-elements-with-text-selectors]

#### Extract data from tables

Similarly to e-commerce item selection you can also select table rows and add
child selectors for data extraction from table cells.
Though [Table selector] [table-selector] might be much better solution.

 [css-selector]: ../CSS%20selector.md
 [element-scroll-selector]: Element%20scroll%20down%20selector.md
 [element-click-selector]: Element%20click%20selector.md
 [table-selector]: Table%20selector.md
 [multiple-elements-with-text-selectors]: ../images/selectors/text/text-selector-multiple-elements-with-text-selectors.png?raw=true