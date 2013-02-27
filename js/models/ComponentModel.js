define([
    "jquery", "backbone", "mvc"
], function($, Backbone, MVC) {
	var ComponentModel = AppBuilder.Model.extend({
		id: -1,
		component: "",
		
		initialize: function(model) {
			AppBuilder.Model.prototype.initialize.call(this);
		}
	});
	return ComponentModel;
});