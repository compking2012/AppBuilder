define([
    "jquery", "backbone", "mvc"
], function($, Backbone, MVC) {
	var UserModel = AppBuilder.Model.extend({
		initialize: function() {
			AppBuilder.Model.prototype.initialize.call(this);
		},
		
		url: function() {
			return configuration.apiPath + "/user";
		},
		
		parse: function(response) {
			if(response.errno) {
				if(response.errno != 0) {
					return {
						errno: response.errno
					};
				}
			}
			
			var data = response.userinfo;
			var result = null;
			if(data.username) {
				result = {
					username: data.username,
					email: data.email,
					phone: data.phone,
					bdstoken: data.bdstoken
				};
			}
			else {
				result = {};
			};
			return result;
		}
	});
	return UserModel;
});