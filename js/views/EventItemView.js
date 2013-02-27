define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/EventItemView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var EventItemView = AppBuilder.View.extend({
		template: template,
		
		event: null,
		
		events: {
			
		},
		
		initialize: function(event) {
			this.event = event;
			AppBuilder.View.prototype.initialize.call(this);
			this.label = this.getElement("span.name");
			this.editAction = this.getElement("select");
		},
		
		destroy: function() {
			this.label = null;
			if(this.editAction) {
				this.editAction.off();
				this.editAction = null;
			}
		},
		
		render: function() {
			this.label.html(this.event.name);
			this.editAction.change($.proxy(this.onChange, this));

			if(this.event.handler) {
				this.editAction.val("javascript");
			}
		},
		
		onChange: function() {
			if(this.editAction.val() == "javascript") {
				this.trigger("onEditEvent", this.event);
			}
		}
	});
	return EventItemView;
});