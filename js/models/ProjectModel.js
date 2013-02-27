define([
    "jquery", "backbone", "mvc"
], function($, Backbone, MVC) {
	var ProjectModel = AppBuilder.Model.extend({

		initialize: function() {
			AppBuilder.Model.prototype.initialize.call(this);
		},
		
		urlRoot: function() {
			return configuration.apiPath + "/projects";
		},
		
		toJSON: function() {
			var json = {
				app_id: this.id,
				app_name: this.get("name"),
				settings: this.get("settings")
			};
			return json;
		},
		
		parse: function(response) {
			if(response.errno) {
				if(response.errno != 0) {
					return {
						errno: response.errno
					};
				}
			}
			
			if(response.errno == undefined || response.projectinfo) {
				var project = (response.errno == undefined ? response : response.projectinfo);
				return {
					id: project.app_id,
					name: project.app_name,
					settings: project.settings,
					apiKey: project.api_key,
					secretKey: project.secret_key,
					createTime: project.create_time,
					releaseTime: project.release_time,
					updateTime: project.update_time,
					lastModified: project.op_uname,
					pages: project.pages || [],
					services: project.services || []
				};
			}
			else {
				return {
					id: response.app_id
				};
			}
		}
	});
	return ProjectModel;
});