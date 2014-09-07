# Table selector

Table selector can extract data from tables. *Table selector* has 3
configurable CSS selectors. The selector is for table selection. When you
select the table for selector the *Table selector* will try to guess selectors
for header row and data rows. You can click Element preview on those selectors
to see whether the *Table selector* found table header and data rows correctly.
The header row selector is used to identify table columns when data is
extracted from multiple pages. Also you can rename table columns. Figure 1
shows what you should select when extracting data from a table.

![Fig. 1: Selectors for table selector] [table-selector-selectors]

## Configuration options
 * selector - [CSS selector] [css-selector] for the table element.
 * header row selector - [CSS selector] [css-selector] for table header row.
 * data rows selector - [CSS selector] [css-selector] for table data rows.
 * multiple - multiple records are being extracted. Usually should be
 checked for Table selector because you are extracting multiple rows.

 [table-selector-selectors]: ../images/selectors/table/selectors.png?raw=true
 [css-selector]: ../CSS%20selector.md