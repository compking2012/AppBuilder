define([
    "jquery", "jqueryui", "chui", "underscore", "backbone", "mvc", 
    "text!views/MobileView.html"
], function($, $ui, $chui, _, Backbone, MVC, template) {
	var MobileView = AppBuilder.View.extend({
		template: template,
		
		events: {
			
		},
		
		shim: null,
		components: [],
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);
		},
		
		render: function() {
		},
		
		showShim: function(isSorting, component, container, point) {
			//TODO: provide a better shim
			if(!isSorting) {
				this.shim = component.node;
				this.shim.addClass("dropshim");
			}
			else {
				if(this.shim == null) {
					this.shim = $("<div class=\"sortshim\"></div>");
				}
				this.shim.css("marginTop", component.node.css("marginTop"));
				this.shim.css("marginLeft", component.node.css("marginLeft"));
				this.shim.css("marginRight", component.node.css("marginRight"));
				this.shim.css("marginBottom", component.node.css("marginBottom"));
				this.shim.css("width", component.node.outerWidth());
				this.shim.css("height", component.node.outerHeight());
			}
			if(!container) {
				$("app").append(this.shim);
				return 0;
			}
			else {
				container.node.append(this.shim);
			}
			for(var i=0; i<container.getChildrenCount(); i++) {
				var target = container.getChild(i);
				if(target == component) {
					continue;
				}
				var rect = target.getNodeRect();
				
				if(point.left >= rect.left && point.left <= rect.right && point.top >= rect.top && point.top <= rect.bottom) {
					if(point.left > (rect.left + rect.right)/2) {
						this.shim.insertAfter(target.node);
						return i+1;
					}
					else {
						this.shim.insertBefore(target.node);
						return i;
					}
				}
			}
			return container.getChildrenCount();
		},

		hideShim: function(isSorting) {
			if(!isSorting) {
				if(this.shim) {
					this.shim.remove();
					this.shim.removeClass("dropshim");
					this.shim = null;
				}
			}
			else {
				if(this.shim) {
					this.shim.remove();
					this.shim = null;
				}
			}
		},

		addComponent: function(component, position, container) {
			this.components.push(component);
			if(container) {
				//TODO: Refactor here for better solution
				container.addChild(component, position);
			}
			else {
				//TODO: ugly here, think about how to unify the concept?
				$("app").append(component.node);
			}
			component.bindEvents();
			component.on("onSelect", $.proxy(this.onSelect, this));
			component.on("onScroll", $.proxy(this.onScroll, this));
		},
		
		onSelect: function(component) {
			this.trigger("onSelect", component);
		},
		
		onScroll: function(component) {
			this.trigger("onScroll", component);
		},
		
		clearComponents: function() {
			$.each(this.components, $.proxy(function(index, component) {
				component.destroy();
			}, this));
			this.components = [];
		},
		
		cancelSort: function(container, component, position) {
			component.node.detach();
			if(position == -1) {
				$("app").append(component.node);
			}
			else if(position > container.node.children().length-1) {
				container.node.append(component.node);
			}
			else {
				container.node.children(":eq(" + position + ")").before(component.node);
			}
		}
	});
	return MobileView;
});