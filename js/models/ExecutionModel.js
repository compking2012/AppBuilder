define([
    "jquery", "backbone", "mvc"
], function($, Backbone, MVC) {
	var ExecutionModel = AppBuilder.Model.extend({

		project: null,
		mode: null,
		
		initialize: function(project, mode) {
			AppBuilder.Model.prototype.initialize.call(this);
			this.project = project;
			this.mode = mode;
		},
		
		url: function() {
			if(this.mode == this.constructor.Mode.RUN) {
				return configuration.apiPath + "/projects/" + this.project.id + "/run";
			}
			else if(this.mode == this.constructor.Mode.DEPLOY) {
				return configuration.apiPath + "/projects/" + this.project.id + "/deploy";
			}
			else if(this.mode == this.constructor.Mode.TEST) {
				return configuration.apiPath + "/projects/" + this.project.id + "/test";
			}
		},
		
		toJSON: function() {
			if(this.mode == this.constructor.Mode.RUN) {
				var json = {
					lang_type: this.get("languageType"),
					htmlcode: this.get("htmlCode"),
					jscode: this.get("jsCode"),
					csscode: this.get("cssCode"),
				};
				return json;
			}
			else if(this.mode == this.constructor.Mode.DEPLOY) {
				var json = {
					version: this.get("version"),
					domain: this.get("domain"),
					lang_type: this.get("languageType"),
					htmlcode: this.get("htmlCode"),
					jscode: this.get("jsCode"),
					csscode: this.get("cssCode"),
				};
				return json;
			}
			else if(this.mode == this.constructor.Mode.TEST) {
				var json = {
				};
				return json;
			}
		},
		
		parse: function(response) {
			if(response.errno) {
				if(response.errno != 0) {
					return {
						errno: response.errno
					};
				}
			}
			
			if(this.mode == this.constructor.Mode.RUN) {
				return {
					URL: response.url
				};
			}
			else if(this.mode == this.constructor.Mode.DEPLOY) {
				return {};
			}
			else if(this.mode == this.constructor.Mode.TEST) {
				return {
					URL: response.url
				};
			}
		}
	}, {
		Mode: {
			RUN: 1,
			DEPLOY: 2,
			TEST: 3
		}
	});
	return ExecutionModel;
});