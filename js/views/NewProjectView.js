define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/NewProjectView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var NewProjectView = AppBuilder.View.extend({
		template: template,
		
		dialog: null,
		name: null,
		
		events: {
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);
			this.name = this.getElement("#name");
		},
		
		destroy: function() {
			this.name = null;
			if(this.dialog) {
				this.dialog.off();
				this.dialog.dialog("destroy");
				this.dialog = null;
			}
			AppBuilder.View.prototype.destroy.call(this);
		},

		render: function() {
			this.dialog = $("#newprojectdialog").dialog({
				height: 140,
				modal: true,
				buttons: [
					{text: "OK", click: $.proxy(this.onClickOK, this)},
					{text: "Cancel", click: $.proxy(this.onClickCancel, this)}
				],
				close: $.proxy(this.onClickCancel, this)
			});
		},
		
		onClickOK: function() {
			this.trigger("onOK", this.name.val());
			this.destroy();
		},
		
		onClickCancel: function() {
			this.trigger("onCancel");
			this.destroy();
		}
	});
	return NewProjectView;
});