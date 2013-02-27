define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc",
    "text!views/HeaderView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var HeaderView = AppBuilder.View.extend({
		template: template,
		
		login: null,
		logout: null,
		
		events: {
			
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);

			this.loginArea = this.getElement("#loginarea");
			this.logoutArea = this.getElement("#logoutarea");
			this.login = this.getElement("#login");
			this.logout = this.getElement("#logout");
			this.username = this.getElement("#username");
		},
		
		render: function() {
			this.login.on("click", $.proxy(this.onClickLogin, this));
			this.logout.on("click", $.proxy(this.onClickLogout, this));
		},
		
		showLoginUser: function(loginUser) {
			if(!loginUser.has("username")) {
				this.loginArea.removeClass("hide");
				this.logoutArea.addClass("hide");
			}
			else {
				this.loginArea.addClass("hide");
				this.logoutArea.removeClass("hide");
				this.username.html(loginUser.get("username"));
			}
		},
		
		onClickLogin: function() {
			this.trigger("onLogin");
			this.loginSystem();
		},
		
		loginSystem: function() {
			window.location = configuration.passportServer + "/v2/?login&tpl=dev&u=" + window.location.href;
		},
		
		onClickLogout: function() {
			this.trigger("onLogout");
			this.logoutSystem();
		},
		
		logoutSystem: function() {
			window.location = configuration.passportServer + "/?logout&tpl=dev&u=" + window.location.href;
		}
	});
	return HeaderView;
});