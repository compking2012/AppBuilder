define([
	"jquery", "underscore", "backbone", "mvc", 
	"views/EventView"
], function($, _, Backbone, MVC, EventView) {
	var EventController = AppBuilder.Controller.extend({
		
		component: null,
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showView: function() {
			this.view = new EventView();
			this.view.on("onEditEvent", $.proxy(this.onEditEvent, this));
			this.node.append(this.view.$el);
			this.view.render();
		},
		
		clearEvents: function() {
			this.view.clearEvents();
		},
		
		showEvents: function(component) {
			this.component = component;
			
			this.clearEvents();
			var events = component.getEvents();
			$.each(events, $.proxy(function(index, event) {
				this.view.addEvent(event);
			}, this));
		},
		
		onEditEvent: function(event) {
			this.parentController.codeController.openEventHandler(this.component, event);
		}
	});
	return EventController;
});