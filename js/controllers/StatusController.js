define([
	"jquery", "underscore", "backbone", "mvc", 
	"views/StatusView"
], function($, _, Backbone, MVC, StatusView) {
	var StatusController = AppBuilder.Controller.extend({
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showView: function() {
			this.view = new StatusView();
			this.node.append(this.view.$el);
			this.view.render();
		}
	});
	return StatusController;
});