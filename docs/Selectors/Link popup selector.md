# Link popup selector

Link popup selector works similarly to [Link selector] [link-selector]. It can
be used for url extraction and site navigation. The only difference is that
Link popup selector should be used when clicking on a link the site opens a new
window (popup) instead of loading the URL in the same tab or opening it in a
new tab. This selector will catch the popup creation event and extract the URL.
If the site creates a visual popup but not a real window then you should try
[Element click selector] [element-click-selector]

Read more about use cases in [Link selector] [link-selector] description.

 [link-selector]: link-selector.md
 [element-click-selector]: element-click-selector.md