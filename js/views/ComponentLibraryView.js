define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "views/ComponentItemView", "components/ComponentFramework",
    "text!views/ComponentLibraryView.html"
], function($, $ui, _, Backbone, MVC, ComponentItemView, ComponentFramework, template) {
	var ComponentLibraryView = AppBuilder.View.extend({
		template: template,
		
		collection: null,
		
		events: {
			
		},
		
		initialize: function(collection) {
			this.collection = collection;
			AppBuilder.View.prototype.initialize.call(this);
		},
		
		render: function() {
			var models = this.collection.models;
			$.each(models, $.proxy(function(index, model) {
				var componentGroup = null;
				if(model.get("type") == "uiComponents") {
					componentGroup = $("#uicomponents");
				}
				else if(model.get("type") == "serviceComponents") {
					componentGroup = $("#servicecomponents");
				}
				else if(model.get("type") == "customComponents") {
					componentGroup = $("#customcomponents");
				}
				$.each(model.get("components"), $.proxy(function(i, component) {
					var componentView = new ComponentItemView(component);
					componentView.pass("onStartDragComponent", this);
					componentView.pass("onStopDragComponent", this);
					componentGroup.append(componentView.$el);
					componentView.render();
				}, this));
			}, this));
			
			$("#groups").accordion({
				autoHeight: false
			});
		}
	});
	return ComponentLibraryView;
});