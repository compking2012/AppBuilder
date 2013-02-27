define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/RunProjectView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var RunProjectView = AppBuilder.View.extend({
		template: template,
		
		device: null,
		screen: null,
		maskarea: null,
		progress: null,
		dialog: null,
		
		events: {
			
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);

			this.device = this.getElement("#device");
			this.screen = this.getElement("#screen");
			this.maskarea = this.getElement("#maskarea");
			this.progress = this.getElement("#progress");
		},
		
		destroy: function() {
			this.device = null;
			this.screen = null;
			this.maskarea = null;
			this.progress = null;
			if(this.dialog) {
				this.dialog.off();
				this.dialog.dialog("destroy");
				this.dialog = null;
			}
			AppBuilder.View.prototype.destroy.call(this);
		},

		
		render: function() {
			this.dialog = $("#runprojectdialog").dialog({
				width: 450,
				height: 860,
				modal: true,
				buttons: [
					{text: "OK", click: $.proxy(this.onClickOK, this)},
				],
				close: $.proxy(this.onClickOK, this)
			});
			
			this.progress.progressbar({
				value: 100
			});
			this.maskarea.hide();
			this.powerOn();
		},
		
		powerOn: function() {
			this.maskarea.show();
			this.progress.show();
			this.screen.attr("src", "");
		},
		
		powerOff: function() {
			this.maskarea.show();
			this.progress.hide();
			this.screen.attr("src", "");
		},
		
		openApp: function(url) {
			this.maskarea.hide();
			this.screen.attr("src", url);
		},
		
		onClickOK: function() {
			this.trigger("onOK");
			this.destroy();
		}
	});
	return RunProjectView;
});