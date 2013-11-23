$(function () {

	// popups for Storage setting input fields
	$("#sitemapDb")
		.popover({
			title: 'Database for sitemap storage',
			html: true,
			content: "CouchDB database url<br /> http://example.com/scraper-sitemaps/",
			placement: 'bottom'
		})
		.blur(function () {
			$(this).popover('hide');
		});

	$("#dataDb")
		.popover({
			title: 'Database for scraped data',
			html: true,
			content: "CouchDB database url. For each sitemap a new DB will be created.<br />http://example.com/",
			placement: 'bottom'
		})
		.blur(function () {
			$(this).popover('hide');
		});

	// switch between configuration types
	$("select[name=storageType]").change(function () {
		var type = $(this).val();

		if (type === 'couchdb') {
			$(".form-group.couchdb").show();
		}
		else {
			$(".form-group.couchdb").hide();
		}
	});

	// Extension configuration
	var config = new Config();

	// load previously synced data
	config.loadConfiguration(function () {

		$("#storageType").val(config.storageType);
		$("#sitemapDb").val(config.sitemapDb);
		$("#dataDb").val(config.dataDb);

		$("select[name=storageType]").change();
	});

	// Sync storage settings
	$("form#storage_configuration").submit(function () {

		var sitemapDb = $("#sitemapDb").val();
		var dataDb = $("#dataDb").val();
		var storageType = $("#storageType").val();

		var newConfig;

		if (storageType === 'local') {
			newConfig = {
				storageType: storageType,
				sitemapDb: ' ',
				dataDb: ' '
			}
		}
		else {
			newConfig = {
				storageType: storageType,
				sitemapDb: sitemapDb,
				dataDb: dataDb
			}
		}

		config.updateConfiguration(newConfig);
		return false;
	});
});