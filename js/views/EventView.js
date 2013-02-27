define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "views/EventItemView", 
    "text!views/EventView.html"
], function($, $ui, _, Backbone, MVC, EventItemView, template) {
	var EventView = AppBuilder.View.extend({
		template: template,
		
		list: null,
		eventWidgets: {},
		
		events: {
			
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);
			this.list = this.getElement("#list");
		},
		
		render: function() {
			
		},
		
		clearEvents: function() {
			this.list.empty();
			for(var widget in this.eventWidgets) {
				this.eventWidgets[widget].destroy();
			}
		},
		
		addEvent: function(event) {
			var item = new EventItemView(event);
			item.pass("onEditEvent", this);
			this.list.append(item.$el);
			this.eventWidgets[event.name] = item;
			item.render();
		}
	});
	return EventView;
});