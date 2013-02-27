define([
	"jquery", "underscore", "backbone", "mvc", 
	"views/ComponentLibraryView", "models/ComponentCollection", "models/ComponentModel", 
	"components/ComponentFramework", "views/ConfirmView"
], function($, _, Backbone, MVC, ComponentLibraryView, ComponentCollection, ComponentLibraryModel, 
		ComponentFramework, ConfirmView) {
	var ComponentLibraryController = AppBuilder.Controller.extend({
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showView: function() {
			var componentCollection = new ComponentCollection();
			componentCollection.fetch({
				success: $.proxy(this.onSuccessRetrieveComponents, this),
				error: $.proxy(this.onErrorRetrieveComponents, this)
			});
		},
		
		onSuccessRetrieveComponents: function(collection) {
			collection.each($.proxy(function(model) {
				$.each(model.get("components"), $.proxy(function(index, componentItem) {
					componentItem.componentClass = ComponentFramework[componentItem.library][componentItem.component];
				}, this));
			}, this));
			this.view = new ComponentLibraryView(collection);
			this.view.pass("onStartDragComponent", this.parentController.canvasController);
			this.view.pass("onStopDragComponent", this.parentController.canvasController);
			this.node.append(this.view.$el);
			this.view.render();
		},
		
		onErrorRetrieveComponents: function(collection, response) {
			var dialog = new ConfirmView("Components retrieved error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		getComponentFromClassInfo: function(classInfo) {
			var componentClass = ComponentFramework[classInfo.library][classInfo.component];
			var component = new componentClass();
			component.generateUICode($);
			return component;
		},
		
		getComponentFromClass: function(componentClass) {
			var component = new componentClass.model["componentClass"]();
			component.generateUICode($);
			return component;
		},
		
		getAllComponents: function(component) {
			if(component) {
				var result = [component];
				if(component.isContainer) {
					$.each(component.children, $.proxy(function(index, child) {
						result = result.concat(this.getAllComponents(child));
					}, this));
				}
				return result;
			}
			else {
				return [];
			}
		}
	});
	return ComponentLibraryController;
});