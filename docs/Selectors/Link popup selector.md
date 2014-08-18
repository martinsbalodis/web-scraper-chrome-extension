# Link popup selector

*Link popup selector* works similarly as [Link selector] [link-selector]. It can
be used for url extraction and site navigation. The only difference is that
*Link popup selector* should be used when clicking on a link the site opens a new
window (popup) instead of loading the URL in the same tab or opening it in a
new tab. This selector will catch the popup creation event and extract the URL.
If the site creates a visual popup but not a real window then you should try
[Element click selector] [element-click-selector]

Note! when selecting these link elements you can move the mouse over the 
element and press "S" to select it to prevent it from opening a popup.

## Use cases
See [Link selector] [link-selector] use cases.

 [link-selector]: Link%20selector.md
 [element-click-selector]: Element%20click%20selector.md