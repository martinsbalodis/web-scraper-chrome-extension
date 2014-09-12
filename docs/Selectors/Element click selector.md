# Element click selector

Element click selector works similarly to
[Element selector] [element-selector]. It's main purpose also is element 
selection that could be given as parent elements to its child selectors. The only
difference is that *Element click selector* can interact with the web page by
clicking on buttons to load new elements. For example a page might use
JavaScript and AJAX for pagination or item loading.

Note! when selecting clickable elements you should select them by moving the
mouse over the element and pressing "S". This kind of selection will avoid
events triggered by the button.

## Configuration options
 * selector - [CSS selector] [css-selector] for the wrapper elements that will
 be used as parent elements for child selectors.
 * click selector - [CSS selector] [css-selector] for the buttons that need to
 be clicked to load more elements.
 * click type - type of how the selector knows when there will be no new
 elements and clicking should stop.
 * multiple - multiple records are being extracted (almost always should be
 checked). Multiple option for child selectors usually should not be checked.
 * delay - delay before element selection and delay between clicking. This
 should usually be specified because the data won't be loaded immediately from
 the server. More than 2000 ms might be a good choice if you you don't want to
 loose data because the server didn't respond fast enough.
 * Discard initial elements - the selector will not return the elements that
 were available before clicking for the first time. This might be useful for
 duplicate removal.

### Click type
#### Click Once

Click Once type will click on the buttons only once. If a new button appears
that can be selected it will be also clicked. For example pagination links
might show pages 1 to 5 but pages 6 to 10 would appear some time later. The
selector will also click on those buttons.

#### Click More

Click More type makes the selector click on given buttons multiple times
until there are no new elements appearing. A new element is considered an
element that has unique text content.

## Use cases

#### Navigate pagination using "Click once" selector type

For example there is a site that displays a list of items and there are some
pagination buttons that reload these items dynamically (after clicking a button
the url doesn't change. changes after hash tag # doesn't count). Using *Element
click selector* you can select these items and buttons that need to be clicked.
The scraper during scraping phase will click these buttons to extract all
elements. Also you need to add child selectors for the *Element click selector*
that select data within each element. In figure 1 you can see how to configure
the *Element click selector* to extract data from the described site.

 ![Fig. 1: Sitemap when using Click once type][image-click-once]

#### Load more items in an e-commerce site by clicking "More" button

This example is similar to the one above. The only difference is that in this
site items are loaded by clicking a single button multiple times. In this case
the *Element click selector* should be configured to use "Click more" click
type. In figure 2 you can see how to configure the *Element click selector*
to extract data from this site.

 ![Fig. 2: Sitemap when using Click more type][image-click-more]

 [image-click-more]: ../images/selectors/element-click/click-more.png?raw=true
 [image-click-once]: ../images/selectors/element-click/click-once.png?raw=true
 [element-selector]: Element%20selector.md
 [css-selector]: ../CSS%20selector.md