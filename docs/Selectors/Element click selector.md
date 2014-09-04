# Element click selector

Click element selector works similarly to
[Element selector] [element-selector]. It's main purpose is also for element
selector that could be given as parent elements to its child selectors. Only
difference is that *Click element selector* can interact with the web page by
clicking on buttons to load new elements. For example a page might use
JavaScript and AJAX for pagination or item loading.

## Configuration options
 * selector - [CSS selector] [css-selector] for the wrapper elements that will
 be used as parent elements for child selectors.
 * click selector - [CSS selector] [css-selector] for the buttons that need to
 be clicked to load more elements.
 * click type - type of how the selector knows when it knows when there will be
 no new elements and clicking should stop.
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

Click More type makes the selector to click on given buttons multiple times
until there are no new elements appearing. A new element is considered an
element that has unique text content.

## Use cases

#### Navigate pagination using click Once selector type


#### Load more items in an e-commerce site by clicking "More" button

 [element-selector]: element-selector.md
 [css-selector]: css-selector.md