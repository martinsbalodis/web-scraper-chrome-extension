# Grouped selector

Grouped selector can group text data from multiple elements into one record.
The extracted and grouped will be stored as JSON.

## Configuration options
 * selector - [CSS selector] [css-selector] for the elements whose text will be
 extracted and stored in JSON format.
 * attribute name - optionally this selector can extract an attribute of the
 selected element. If specified the extractor will also add this attribute to
 the result set.

## Use cases

#### Extract article references

For example you are extracting a news article that might have multiple
reference links. If you are selecting these links with link selector with
multiple checked you would get duplicate articles in the result set where each
record would contain one reference link. Using grouped selector you could
serialize all there reference links in one record. To do that select all
reference links and set attribute name to `href` to also extract links to these
sites.

 [css-selector]: css-selector.md