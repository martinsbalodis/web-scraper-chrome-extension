var SelectorGraphv2 = function (sitemap) {
	this.sitemap = sitemap;
};

SelectorGraphv2.prototype = {

	/**
	 * Inits d3.layout.tree
	 */
	initTree: function (w, h) {

		this.tree = d3.layout.tree().size([h, w]);
		this.tree.children(this.getSelectorVisibleChildren.bind(this));
	},
	getSelectorChildren: function (parentSelector) {

		if (parentSelector.childSelectors === undefined) {
			parentSelector.childSelectors = this.sitemap.selectors.getDirectChildSelectors(parentSelector.id).fullClone();
		}

		if (parentSelector.childSelectors.length === 0) {
			return null;
		}
		else {
			return parentSelector.childSelectors;
		}
	},

	getSelectorVisibleChildren: function (parentSelector) {

		// initially hide selector children
		if (parentSelector.visibleChildren === undefined) {
			parentSelector.visibleChildren = false;
		}

		if (parentSelector.visibleChildren === false) {
			return null;
		}

		return this.getSelectorChildren(parentSelector);

	},

	selectorHasChildren: function (parentSelector) {

		var children = this.sitemap.selectors.getDirectChildSelectors(parentSelector.id);
		var selectorHasChildren = children.length > 0;
		return selectorHasChildren;
	},

	/**
	 * function for line drawing between two nodes
	 */
	diagonal: d3.svg.diagonal()
		.projection(function (d) {
			return [d.y, d.x];
		}),

	draw: function (element, w, h) {
		var m = [20, 120, 20, 120],
			w = w - m[1] - m[3],
			h = h - m[0] - m[2],
			i = 0,
			root,
			selectorList;

		this.initTree(w, h);

		// @TODO use element
		this.svg = d3.select(element).append("svg:svg")
			.attr("width", w + m[1] + m[3])
			.attr("height", h + m[0] + m[2])
			.append("svg:g")
			.attr("transform", "translate(" + m[3] + "," + m[0] + ")");

		this.root = {
			id: '_root',
			x0: h / 2,
			y0: 0,
			i: '_root'
		};

		this.update(this.root);
	},

	/**
	 * Color for selectors circle
	 * @param selector
	 */
	getNodeColor: function (selector) {

		if (this.selectorHasChildren(selector) && !selector.visibleChildren) {
			return "lightsteelblue";
		}
		else {
			return "#fff";
		}
	},

	update: function (source) {
		var duration = 500;

		// Compute the new tree layout.
		var nodes = this.tree.nodes(this.root).reverse();

		// Normalize for fixed-depth.
		nodes.forEach(function (d) {
			d.y = d.depth * 100;
		});
		var i = 0;
		// Update the nodes…
		var node = this.svg.selectAll("g.node")
			.data(nodes, function (d) {
				if (d.i === undefined) {
					d.i = d.id;
					d.i = source.i + "/" + d.i;
				}
				return d.i;
			});

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("svg:g")
			.attr("class", "node")
			.attr("transform", function (d) {
				return "translate(" + source.y0 + "," + source.x0 + ")";
			})
			.on("click", function (d) {
				this.toggle(d);
				this.update(d);
			}.bind(this));

		nodeEnter.append("svg:circle")
			.attr("r", 1e-6)
			.style("fill", this.getNodeColor.bind(this));

		nodeEnter.append("svg:text")
			.attr("x", function (d) {
				return this.selectorHasChildren(d) ? -10 : 10;
			}.bind(this))
			.attr("dy", ".35em")
			.attr("text-anchor", function (d) {
				return this.selectorHasChildren(d) ? "end" : "start";
			}.bind(this))
			.text(function (d) {
				return d.id;
			})
			.style("fill-opacity", 1e-6);

		// Transition nodes to their new position.
		var nodeUpdate = node.transition()
			.duration(duration)
			.attr("transform", function (d) {
				return "translate(" + d.y + "," + d.x + ")";
			});

		nodeUpdate.select("circle")
			.attr("r", 6)
			.style("fill", this.getNodeColor.bind(this));

		nodeUpdate.select("text")
			.style("fill-opacity", 1);

		// Transition exiting nodes to the parent's new position.
		var nodeExit = node.exit().transition()
			.duration(duration)
			.attr("transform", function (d) {
				return "translate(" + source.y + "," + source.x + ")";
			})
			.remove();

		nodeExit.select("circle")
			.attr("r", 1e-6);

		nodeExit.select("text")
			.style("fill-opacity", 1e-6);

		// Update the links…
		var link = this.svg.selectAll("path.link")
			.data(this.tree.links(nodes), function (d) {
				return d.target.i;
			});

		// Enter any new links at the parent's previous position.
		link.enter().insert("svg:path", "g")
			.attr("class", "link")
			.attr("d", function (d) {
				var o = {x: source.x0, y: source.y0};
				var res = this.diagonal({source: o, target: o});
				return res;
			}.bind(this))
			.transition()
			.duration(duration)
			.attr("d", this.diagonal);

		// Transition links to their new position.
		link.transition()
			.duration(duration)
			.attr("d", this.diagonal);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition()
			.duration(duration)
			.attr("d", function (d) {
				var o = {x: source.x, y: source.y};
				return this.diagonal({source: o, target: o});
			}.bind(this))
			.remove();

		// Stash the old positions for transition.
		nodes.forEach(function (d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	},

	toggle: function (d) {
		d.visibleChildren = !d.visibleChildren;
	}
};