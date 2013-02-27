define([
    "jquery", "jqueryui", "jquerymenu", "bootstrap", "underscore", "backbone", "mvc", 
    "text!views/ToolbarView.html"
], function($, $ui, $uimenu, bootstrap, _, Backbone, MVC, template) {
	var ToolbarView = AppBuilder.View.extend({
		template: template,
		
		events: {
			"click #newproject": "onClickNewProject",
			"click #openproject": "onClickOpenProject",
			"click #saveproject": "onClickSaveProject",
			"click #closeproject": "onClickCloseProject",
			"click #removeproject": "onClickRemoveProject",
			"click #setupproject": "onClickSetupProject",
			"click #newpage": "onClickNewPage",
			
			"click #undo": "onClickUndo",
			"click #redo": "onClickRedo",
			"click #removepage": "onClickRemovePage",
			"click #copycomponent": "onClickCopyComponent",
			"click #cutcomponent": "onClickCutComponent",
			"click #pastecomponent": "onClickPasteComponent",
			"click #removecomponent": "onClickRemoveComponent",
			"click #runproject": "onClickRunProject",
			"click #deployproject": "onClickDeployProject",
			"click #testproject": "onClickTestProject"
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);
		},
		
		render: function() {
			$("#menu").superfish();
		},
		
		onClickNewProject: function() {
			this.trigger("onNewProject");
		},
		
		onClickOpenProject: function() {
			this.trigger("onOpenProject");
		},
		
		onClickSaveProject: function() {
			this.trigger("onSaveProject");
		},
		
		onClickCloseProject: function() {
			this.trigger("onCloseProject");
		},

		onClickRemoveProject: function() {
			this.trigger("onRemoveProject");
		},
		
		onClickSetupProject: function() {
			this.trigger("onSetupProject");
		},

		onClickNewPage: function() {
			this.trigger("onNewPage");
		},
		
		onClickUndo: function() {
			this.trigger("onUndo");
		},
		onClickRedo: function() {
			this.trigger("onRedo");
		},
		
		onClickRemovePage: function() {
			this.trigger("onRemovePage");
		},
		
		onClickCopyComponent: function() {
			this.trigger("onCopyComponent");
		},
		
		onClickCutComponent: function() {
			this.trigger("onCutComponent");
		},
		
		onClickPasteComponent: function() {
			this.trigger("onPasteComponent");
		},
		
		onClickRemoveComponent: function() {
			this.trigger("onRemoveComponent");
		},
		
		onClickRunProject: function() {
			this.trigger("onRunProject");
		},
		
		onClickDeployProject: function() {
			this.trigger("onDeployProject");
		},
		
		onClickTestProject: function() {
			this.trigger("onTestProject");
		}
	});
	return ToolbarView;
});