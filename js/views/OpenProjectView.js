define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/OpenProjectView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var OpenProjectView = AppBuilder.View.extend({
		template: template,
		
		projects: null,
		list: null,
		dialog: null,
		
		events: {
		},
		
		initialize: function(projects) {
			this.projects = projects;
			AppBuilder.View.prototype.initialize.call(this);
			this.list = this.getElement("#list"); 
		},
		
		destroy: function() {
			if(this.list) {
				this.list.empty();
				this.list = null;
			}
			if(this.dialog) {
				this.dialog.off();
				this.dialog.dialog("destroy");
				this.dialog = null;
			}
			AppBuilder.View.prototype.destroy.call(this);
		},

		render: function() {
			this.list.empty();
			this.projects.each($.proxy(function(project) {
				var item = $("<li></li>").append("<a href=\"javascript:void(0)\">" + project.get("name") + "</a>");
				item.on("click", {project: project}, $.proxy(this.onClickProject, this));
				this.list.append(item);
			}, this));			
			
			this.dialog = $("#openprojectdialog").dialog({
				height: 500,
				modal: true,
				buttons: [
					{text: "Cancel", click: $.proxy(this.onClickCancel, this)}
				],
				close: $.proxy(this.onClickCancel, this)
			});
		},
		
		onClickProject: function(event) {
			this.trigger("onOK", event.data.project);
			this.destroy();
		},
		
		onClickCancel: function() {
			this.trigger("onCancel");
			this.destroy();
		}
	});
	return OpenProjectView;
});