define([
    "jquery", "backbone", "mvc"
], function($, Backbone, MVC) {
	var PageModel = AppBuilder.Model.extend({
		project: null,
		
		initialize: function(project) {
			this.project = project;
			AppBuilder.Model.prototype.initialize.call(this);
		},
		
		toJSON: function() {
			var json = {
				page_id: this.id,
				page_name: this.get("name"),
				components: this.get("components")
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
			
			if(response.errno == undefined || response.pageinfo) {
				var page = (response.errno == undefined ? response : response.pageinfo);
				return {
					id: page.page_id,
					name: page.page_name,
					createTime: page.create_time,
					updateTime: page.update_time,
					lastModified: page.op_uname,
					components: page.components || []
				};
			}
			else {
				return {
					id: response.page_id
				};
			}
		}
	});
	return PageModel;
});