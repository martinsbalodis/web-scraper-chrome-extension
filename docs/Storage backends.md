# Storage backends

Web scraper can be configured to use either local storage or CouchDB. By
default all data is stored in the local storage.

## Local storage

Local storage backend uses browsers built in database to store data. This data
is not replicated from one chrome instance to another.

## CouchDB

[CouchDB] [couchdb] is a RESTful NoSQL JavaScript database. You can configure
the extension to store sitemaps and scraped data in this database. The data
then could be accessible from all your chrome instances. To do that
you need to configure it in the options page. You can open it by right clicking
extensions icon and selecting options. There you can switch between storage
backends. For CouchDB you need to add configure the database where sitemaps
will be storend and the couchdb db server where scraped data will be stored.
For example you can configure it like this:

 * sitemap db - http://localhost:5984/scraper-sitemaps
 * data db - http://localhost:5984/

 [couchdb]: http://couchdb.apache.org/
