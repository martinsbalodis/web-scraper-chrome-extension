# CSS selector

Web Scraper uses css selectors to find HTML elements in web pages and to extract
data from them. When selecting an element the Web Scraper will try to make its
best guess what the CSS selector might be for the selected elements. But you
can also write it yourself and test it with by clicking "Element preview". You
can use CSS selectors that are available in CSS versions 1-3 and also pseudo
selectors that are additionally available in jQuery. Here are some
documentation links that might help you:
 
 * [CSS Selectors] [css-selectors-wikipedia]
 * [jQuery CSS selectors] [css-selectors-jquery]
 * [w3schools CSS selector reference] [w3schools-css-selector-reference]

## Additional Web Scraper selectors
It is possible to add new pseudo CSS selectors to Web Scraper. Right now there
is only one CSS selector added.

#### Parent selector

CSS Selector `_parent_` allows a child selector of an
*Element selector* to select the element that was returned by the *Element selector*. For
example this CSS selector could be used in a case where you need to extract an
attribute from the element that the *Element selector* returned.

 [css-selectors-wikipedia]: http://en.wikipedia.org/wiki/Cascading_Style_Sheets#Selector
 [css-selectors-jquery]: http://api.jquery.com/category/selectors/
 [w3schools-css-selector-reference]: http://www.w3schools.com/cssref/css_selectors.asp