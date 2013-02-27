define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/SetupProjectView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var SetupProjectView = AppBuilder.View.extend({
		template: template,
		
		settings: null,
		pages: null,
		dialog: null,
		
		events: {
		},
		
		initialize: function(settings, pages) {
			this.settings = settings;
			this.pages = pages;
			AppBuilder.View.prototype.initialize.call(this);
			this.appFullName = this.getElement("#appfullname");
			this.appDescription = this.getElement("#appdescription");
			this.appAuthor = this.getElement("#appauthor");
			this.appTouchIcon = this.getElement("#apptouchicon");
			this.appTouchIconPreview = this.getElement("#apptouchiconpreview");
			this.appStartupImage = this.getElement("#appstartupimage");
			this.appStartupImagePreview = this.getElement("#appstartupimagepreview");
			this.appDefaultPageName = this.getElement("#appdefaultpagename");
		},
		
		destroy: function() {
			this.appFullName = null;
			this.appDescription = null;
			this.appAuthor = null;
			this.appTouchIcon = null;
			this.appTouchIconPreview = null;
			this.appStartupImage = null;
			this.appStartupImagePreview = null;
			this.appDefaultPageName = null;
			if(this.dialog) {
				this.dialog.off();
				this.dialog.dialog("destroy");
				this.dialog = null;
			}
			AppBuilder.View.prototype.destroy.call(this);
		},
		
		render: function() {
			this.settings = this.settings || {};
			this.appFullName.val(this.settings.appFullName);
			this.appDescription.val(this.settings.appDescription);
			this.appAuthor.val(this.settings.appAuthor);
			this.appTouchIcon.val(this.settings.appTouchIcon);
			this.enableLocalPreview(this.appTouchIcon, this.appTouchIconPreview);
			if(this.settings.appTouchIcon) {
				this.appTouchIconPreview.attr("src", this.settings.appTouchIcon);
			}
			this.appStartupImage.val(this.settings.appStartupImage);
			this.enableLocalPreview(this.appStartupImage, this.appStartupImagePreview);
			if(this.settings.appStartupImage) {
				this.appStartupImagePreview.attr("src", this.settings.appStartupImage);
			}
			this.pages.each($.proxy(function(page) {
				var item = $("<option></option>");
				item.attr("value", page.get("name"));
				item.html(page.get("name"));
				this.appDefaultPageName.append(item);
			}, this));
			this.appDefaultPageName.val(this.settings.appDefaultPageName);
			
			this.dialog = $("#setupprojectdialog").dialog({
				height: 500,
				modal: true,
				buttons: [
					{text: "OK", click: $.proxy(this.onClickOK, this)},
					{text: "Cancel", click: $.proxy(this.onClickCancel, this)}
				],
				close: $.proxy(this.onClickCancel, this)
			});
		},
		
		enableLocalPreview: function(fileNode, previewNode) {
			fileNode.on("change", function() {
				var reader = new FileReader();
				reader.onload = function(e) {
					previewNode.attr("src", e.target.result);
				};
				reader.readAsDataURL(this.files[0]);
			});
		},
		
		onClickOK: function() {
			var settings = {
				appFullName: this.appFullName.val(),
				appDescription: this.appDescription.val(),
				appAuthor: this.appAuthor.val(),
				appTouchIcon: this.appTouchIconPreview.attr("src"),
				appStartupImage: this.appStartupImagePreview.attr("src"),
				appDefaultPageName: this.appDefaultPageName.val()
			};
			this.trigger("onOK", settings);
			this.destroy();
		},
		
		onClickCancel: function() {
			this.trigger("onCancel");
			this.destroy();
		}
	});
	return SetupProjectView;
});