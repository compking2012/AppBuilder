define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/ConfirmView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var ConfirmView = AppBuilder.View.extend({
		template: template,
		
		dialog: null,
		message: null,
		style: null,
		
		events: {
		},
		
		initialize: function(message, style) {
			AppBuilder.View.prototype.initialize.call(this);
			this.message = this.getElement("#message");
			this.message.html(message);
			this.style = style;
		},
		
		destroy: function() {
			this.message = null;
			if(this.dialog) {
				this.dialog.off();
				this.dialog.dialog("destroy");
				this.dialog = null;
			}
			AppBuilder.View.prototype.destroy.call(this);
		},
		
		render: function() {
			var params = {
				height: 140,
				modal: true,
				buttons: []
			};
			
			if(this.style == this.constructor.style.MESSAGE || this.style == this.constructor.style.ALERT) {
				params.buttons.push({text: "OK", click: $.proxy(this.onClickOK, this)});
				params.close = $.proxy(this.onClickOK, this);
				if(this.style == this.constructor.style.ALERT) {
					this.message.css({"color": "red"});
				}
			}
			else if(this.style == this.constructor.style.CONFIRM) {
				params.buttons.push({text: "OK", click: $.proxy(this.onClickOK, this)});
				params.buttons.push({text: "Cancel", click: $.proxy(this.onClickCancel, this)});
				params.close = $.proxy(this.onClickCancel, this);
			}
			
			this.dialog = $("#confirmdialog").dialog(params);
		},
		
		onClickOK: function() {
			this.trigger("onOK");
			this.destroy();
		},
		
		onClickCancel: function() {
			this.trigger("onCancel");
			this.destroy();
		}
	}, {
		style: {
			MESSAGE: 1,
			ALERT: 2,
			CONFIRM: 5
		}
	});
	return ConfirmView;
});