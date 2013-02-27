define([
    "jquery", "backbone", "mvc",
    "models/PageModel"
], function($, Backbone, MVC, PageModel) {
	var PageCollection = AppBuilder.Collection.extend({
		model: PageModel,
		project: null,
		
		initialize: function(project) {
			this.project = project;
			AppBuilder.Collection.prototype.initialize.call(this);
		},
		
		url: function() {
			return configuration.apiPath + "/projects/" + this.project.get("id") + "/pages";
		},
		
		parse: function(response) {
			return response.pagelist;
		}		
	});
	return PageCollection;
});