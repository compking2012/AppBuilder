define([
	"jquery", "jquerycookie", "underscore", "backbone", "mvc",
	"models/UserModel",	"views/HeaderView"
], function($, $cookie, _, Backbone, MVC, UserModel, HeaderView) {
	var HeaderController = AppBuilder.Controller.extend({
		
		loginUser: null,
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showView: function() {
			this.view = new HeaderView();
			this.view.on("onLogin", $.proxy(this.onLogin, this));
			this.view.on("onLogout", $.proxy(this.onLogout, this));
			this.node.append(this.view.$el);
			this.view.render();
			
			this.getLoginUser();
		},
		
		onLogin: function() {
			this.parentController.disableLeavePretection();
		},
		
		onLogout: function() {
			this.parentController.disableLeavePretection();
		},
		
		saveToken: function() {
			$.cookie("bdstoken", this.loginUser.get("bdstoken"));
		},
		
		getLoginUser: function() {
			this.loginUser = new UserModel();
			this.loginUser.fetch({
				success: $.proxy(this.onSuccessRetrieveLoginUser, this),
				error: $.proxy(this.onErrorRetrieveLoginUser, this)
			});
		},
		
		onSuccessRetrieveLoginUser: function(userModel) {
			this.view.showLoginUser(userModel);
			this.saveToken();
		},
		
		onErrorRetrieveLoginUser: function() {
			
		}
	});
	return HeaderController;
});