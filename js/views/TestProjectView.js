define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/TestProjectView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var TestProjectView = AppBuilder.View.extend({
		template: template,
		
		mtc: null,
		dialog: null,
		
		events: {
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);
			this.mtc = this.getElement("#mtc");
		},
		
		destroy: function() {
			this.mtc = null;
			if(this.dialog) {
				this.dialog.off();
				this.dialog.dialog("destroy");
				this.dialog = null;
			}
			AppBuilder.View.prototype.destroy.call(this);
		},
		
		render: function() {
			this.dialog = $("#testprojectdialog").dialog({
				width: 1012,
				height: 806,
				modal: true,
				buttons: [
					{text: "OK", click: $.proxy(this.onClickOK, this)}
				],
				close: $.proxy(this.onClickOK, this)
			});
		},
		
		openApp: function(url) {
			this.mtc.attr("src", url);
		},
		
		powerOff: function() {
			this.mtc.attr("src", "");
		},
		
		onClickOK: function() {
			this.trigger("onOK");
			this.destroy();
		}
	});
	return TestProjectView;
});