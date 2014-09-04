# Text selector

Text selector is used for text selection. The text selector will extract text
from the selected element and from all its child elements. HTML will be
stripped and only text will be returned. Selector will ignore text within
`<script>` and `<style>` tags. New line `<br>` tags will be replaced with
newline characters. You can additionally apply a regular expression to
resulting data.

## Configuration options

 * selector - [CSS selector] [css-selector] for the element from which data
 will be extracted.
 * multiple - multiple records are being extracted. Usually should not be
 checked. If you want to use multiple text selectors within one page with
 multiple checked then you might actually need
 [Element selector] [element-selector].
 * regex - regular expression to extract a substring from the result.

### Regex

The regular expression attribute can be used to extract a substring of the text
that the selector extracts. When a regular expression is used the whole match
(group 0) will be returned as a result  [www.regexr.com] [regex-site] is a
great site where you can learn about regular expressions and try them out.

Here are some examples that you might find useful:

| text             	| regex                          	| result     	|
|------------------	|--------------------------------	|------------	|
| price: 14.99$    	| `[0-9]+\.[0-9]+`               	| 14.99      	|
| id: H83JKDX4     	| `[A-Z0-9]{8}`                  	| H83JKDX4   	|
| date: 2014-08-20 	| `[0-9]{4}\-[0-9]{2}\-[0-9]{2}` 	| 2014-08-20 	|

## Use cases
**Extract one record per page with multiple text selectors**

For example you are scraping news site that has one article per page. The page
might contain the article, its title, date published and the author. A
*Link selector* can navigate the scraper to each of these article pages.
Multiple text selectors can extract the title, date, author and article.
*Multiple* option should be left unchecked for text selectors because each page
is extracting only one record.

![Fig. 1: Multiple text selectors per page][text-selector-multiple-single-text-selectors-in-one-page]

**Extract multiple items with multiple text selectors per page**

E-commerce sites usually have multiple items per page. If you want to scrape
these items you will need an *Element selector* that selects item wrapper
elements and multiple text selectors that select data within each item wrapper
element.

![Fig. 2: Multiple elements with text selectors. Some arrows are skipped.][text-selector-multiple-elements-with-text-selectors]

**Extract multiple text records per page**

For example you want to extract comments for an article. There are multiple
comments in a single page and you only need the comment text (If you would need
other comment attributes then see the example above). You can use
*Text selector* to extract these comments. The *Text selectors* multiple
attribute should be checked because you will be extracting multiple records.

![Fig. 3: Text selector selects multiple comments][text-selector-multiple-per-page]


 [regex-site]: http://www.regexr.com/
 [text-selector-multiple-single-text-selectors-in-one-page]: ../images/selectors/text/text-selector-multiple-single-text-selectors-in-one-page.png?raw=true
 [text-selector-multiple-elements-with-text-selectors]: ../images/selectors/text/text-selector-multiple-elements-with-text-selectors.png?raw=true
 [text-selector-multiple-per-page]: ../images/selectors/text/text-selector-multiple-per-page.png?raw=true
 [element-selector]: Element%20selector.md
 [css-selector]: css-selector.md
