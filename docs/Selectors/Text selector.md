# Text selector
Used for text selection. All HTML will be stripped and only text will be
returned. You can additionally apply regex to resulting data. Regex is applied
before data export so you can change the regex after data is scraped. If a
link element is selected then also its href attribute will be returned, but
the scraper will not follow the link.