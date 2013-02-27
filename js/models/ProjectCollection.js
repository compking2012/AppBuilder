define([
    "jquery", "backbone", "mvc",
    "models/ProjectModel"
], function($, Backbone, MVC, ProjectModel) {
	var ProjectCollection = AppBuilder.Collection.extend({
		model: ProjectModel,
		
		initialize: function() {
			AppBuilder.Collection.prototype.initialize.call(this);
		},
		
		url: function() {
			return configuration.apiPath + "/projects";
		},
		
		parse: function(response) {
			return response.projectlist;
		}		
	});
	return ProjectCollection;
});