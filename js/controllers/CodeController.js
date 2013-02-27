define([
	"jquery", "underscore", "backbone", "mvc", 
	"views/CodeView"
], function($, _, Backbone, MVC, CodeView) {
	var CodeController = AppBuilder.Controller.extend({
		views: [],
		compoenent: null,
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showView: function() {
			this.on("onCloseTab", $.proxy(this.onCloseTab, this));
		},
		
		openEventHandler: function(component, event) {
			var name = component.getProperty("ID").value + "_" + event.name;
			var tabID = "#code_" + name;
			for(var i=0; i<this.views.length; i++) {
				var id = "#code_" + this.views[i].getCodeTitle();
				if(tabID == id) {
					this.parentController.openCodeView(tabID);
					return;
				}
			}
			
			var view = new CodeView(name);
			view.on("onSaveCode", $.proxy(this.onSaveCode, this));
			var node = this.parentController.createCodeViewNode(view);
			node.append(view.$el);
			view.render();
			var title = "Code:" + view.getCodeTitle();
			this.parentController.addCodeView(tabID, title, view);
			this.views.push(view);

			view.openCode(event);
		},
		
		onSaveCode: function(event, handler) {
			event.handler = handler;
			this.parentController.mobileController.saveComponents();
		},
		
		onCloseTab: function(tabID) {
			for(var i=0; i<this.views.length; i++) {
				var id = "#code_" + this.views[i].getCodeTitle();
				if(tabID == id) {
					this.views.splice(i, 1);
					this.parentController.removeCodeView(tabID);
					break;
				}
			}
		}
	});
	return CodeController;
});