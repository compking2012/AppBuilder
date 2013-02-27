define([
	"jquery", "underscore", "backbone", "mvc", 
	"views/PropertyView"
], function($, _, Backbone, MVC, PropertyView) {
	var PropertyController = AppBuilder.Controller.extend({
		
		component: null,
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showView: function() {
			this.view = new PropertyView();
			this.view.on("onPropertyChange", $.proxy(this.onPropertyChange, this));
			this.node.append(this.view.$el);
			this.view.render();
		},
		
		clearProperties: function() {
			this.view.clearProperties();
		},
		
		showProperties: function(component) {
			this.component = component;
			
			this.clearProperties();
			var properties = component.getProperties();
			$.each(properties, $.proxy(function(index, property) {
				this.view.addProperty(property);
			}, this));
		},
		
		setPropertyValue: function(name, value) {
			this.view.setPropertyValue(name, value);
		},
		
		onPropertyChange: function(name, value) {
			this.component.trigger("onPropertyChange", name, value);
			this.parentController.canvasController.resizeComponent(this.component);
		}
	});
	return PropertyController;
});