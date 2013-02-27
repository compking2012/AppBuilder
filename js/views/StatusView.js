define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/StatusView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var StatusView = AppBuilder.View.extend({
		template: template,
		
		events: {
			
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);
		},
		
		render: function() {
		}
	});
	return StatusView;
});