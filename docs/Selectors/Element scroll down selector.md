# Element scroll down selector

This is another Element selector that works similarly to Element selector but
additionally it scrolls down the page multiple times to find those elements
which are added when page is scrolled down to the bottom. Use the delay
attribute to configure waiting interval between scrolling and element search.
Scrolling is stopped after no new elements are found. If the page can scroll
infinitely then this selector will be stuck in an infinite loop.

## Configuration options

 * selector - [CSS selector] [css-selector] for the element.
 * multiple - multiple records are being extracted (almost always should be
 checked). Multiple option for child selectors usually should not be checked.
 * delay - delay before element selection and delay between scrolling. This
 should usually be specified because the data won't be loaded immediately from
 the server after scrolling down. More than 2000 ms might be a good choice if
 you you don't want to loose data because the server didn't respond fast enough.

## Use cases
See [Element selector] [element-selector] use cases.

 [element-selector]: Element%20selector.md
 [css-selector]: ../CSS%20selector.md