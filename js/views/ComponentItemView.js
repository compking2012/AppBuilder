define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/ComponentItemView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var ComponentItemView = AppBuilder.View.extend({
		template: template,
		
		model: null,
		
		events: {
			
		},
		
		initialize: function(model) {
			this.model = model;
			AppBuilder.View.prototype.initialize.call(this);
			this.image = this.getElement("img");
			this.label = this.getElement("span");
		},
		
		render: function() {
			this.image.attr("src", configuration.staticPath + "/" + this.model.componentClass.meta.icon);
			this.label.html(this.model.componentClass.meta.name);
			this.$el.data("cid", this.model.componentClass.meta.name);
			this.$el.draggable({
				appendTo: "body",
				cursorAt: {
					left: -5,
					top: -5
				},
				revert: true,
				helper: function() {
					var icon = $(":first", this).clone();
					var addIcon = $("<div></div>");
					addIcon.css({
						position: "absolute",
						top: "4px",
						left: "4px"
					});
					$(icon).append(addIcon);
					return icon;
				},
				start: $.proxy(this.onStartDrag, this),
				stop: $.proxy(this.onStopDrag, this)
			});
		},
		
		onStartDrag: function() {
			this.trigger("onStartDragComponent", this);
		},
		
		onStopDrag: function() {
			this.trigger("onStopDragComponent", this);
		}
	});
	return ComponentItemView;
});