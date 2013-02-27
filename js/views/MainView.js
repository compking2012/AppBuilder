define([
    "jquery", "jqueryui", "jqueryuilayout", "underscore", "backbone", "mvc", 
    "text!views/MainView.html"
], function($, $ui, $uilayout, _, Backbone, MVC, template) {
	var MainView = AppBuilder.View.extend({
		template: template,
		
		workspace: null,
		toolboxTabs: null,
		workareaTabs: null,
		sidebarTabs: null,
		
		events: {
			
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);
			this.workspace = this.getElement("#workspace");
			this.toolboxTabs = this.getElement("#toolbox .tabs");
			this.workareaTabs = this.getElement("#workarea .tabs");
			this.sidebarTabs = this.getElement("#sidebar .tabs");
		},
		
		render: function() {
			$(window).on("beforeunload", $.proxy(this.onBeforeUnload, this));
			this.$el.layout({
				spacing_open: 0,
				resizable: false,
				closable: false,
				north__size: 60,
				south__size: 60,
			});
			this.workspace.layout({
				spacing_open: 2,
				north__resizable: false,
				north__closable: false,
				north__spacing_open: 0,
				north__showOverflowOnHover: true,
				north__size: 60,
				west__size: 240,
				east__size: 240,
			});
			this.toolboxTabs.tabs();
			this.workareaTabs.tabs();
			this.workareaTabs.tabs({add: $.proxy(this.onAddCodeViewTab, this)});
			this.sidebarTabs.tabs();
		},
		
		onBeforeUnload: function() {
			return "Your editing content may be unsaved.";
		},
		
		activateProjectView: function() {
			this.toolboxTabs.tabs("select", "#project");
		},
		
		activateComponentView: function() {
			this.toolboxTabs.tabs("select", "#component");
		},
		
		activateCanvasView: function() {
			this.workareaTabs.tabs("select", "#canvas");
		},
		
		activatePropertyView: function() {
			this.sidebarTabs.tabs("select", "#property");
		},
		
		activateEventView: function() {
			this.sidebarTabs.tabs("select", "#event");
		},
		
		createCodeViewNode: function(tabID) {
			var node = $("<div id=\"" + tabID + "\"></div>");
			this.workareaTabs.append(node);
			return node;
		},
		
		addCodeView: function(tabID, title, view) {
			this.workareaTabs.tabs("add", tabID, title);
			this.workareaTabs.find(tabID).append(view.$el);
			this.workareaTabs.tabs("select", tabID);
		},
		
		openCodeView: function(tabID) {
			this.workareaTabs.tabs("select", tabID);
		},
		
		onAddCodeViewTab: function(event, ui) {
			var tab = $(ui.tab);
			var tabParent = tab.parent(); 
			var closeButton = $("<button></button>");
			closeButton.appendTo(tabParent);
			closeButton.click($.proxy(function() {
				var tabID = tab.attr("href");
				this.onClickCloseTab(tabID);
			}, this)); 
			tab.dblclick($.proxy(function() {
				var tabID = tab.attr("href");
				this.onClickCloseTab(tabID);
			}, this));
		},
		
		removeCodeView: function(tabID) {
			this.workareaTabs.find(tabID).remove();
			this.workareaTabs.tabs("remove", tabID);
		},
		
		disableLeavePretection: function() {
			$(window).off("beforeunload");
		},
		
		onClickCloseTab: function(tabID) {
			this.trigger("onCloseTab", tabID);
		}
	});
	return MainView;
});