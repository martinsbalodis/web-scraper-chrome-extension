# Element scroll selector

This is another Element selector that works similarly to Element selector but
additionally it scrolls down the page multiple times to find those elements
which are added when page is scrolled down to the bottom. Use the delay
attribute to configure waiting interval between scrolling and element search.
Scrolling is stopped after no new elements are found. If the page can scroll
infinitely then this selector will be stuck in an infinite loop.