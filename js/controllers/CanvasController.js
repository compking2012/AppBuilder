define([
	"jquery", "underscore", "backbone", "mvc", 
	"views/CanvasView" 
], function($, _, Backbone, MVC, CanvasView) {
	var CanvasController = AppBuilder.Controller.extend({
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showView: function() {
			this.on("onStartDragComponent", $.proxy(this.onStartDragComponent, this));
			this.on("onStopDragComponent", $.proxy(this.onStopDragComponent, this));
	
			this.view = new CanvasView();
			this.parentController.on("onMobileReady", $.proxy(function() {
				this.view.pass("onDropOver", this.parentController.mobileController);
				this.view.pass("onDropOut", this.parentController.mobileController);
				this.view.pass("onDrop", this.parentController.mobileController);
				this.view.pass("onMouseMove", this.parentController.mobileController);
				this.view.pass("onResize", this.parentController.mobileController);
				this.view.pass("onStopResize", this.parentController.mobileController);
				this.view.pass("onPointSelect", this.parentController.mobileController);
				this.view.pass("onUnselect", this.parentController.mobileController);
				this.view.pass("onStartSort", this.parentController.mobileController);
				this.view.pass("onSort", this.parentController.mobileController);
				this.view.pass("onStopSort", this.parentController.mobileController);
			}, this));
			this.node.append(this.view.$el);
			this.view.render();
		},
		
		onStartDragComponent: function(component) {
			this.view.startDragComponent(component);
		},
		
		onStopDragComponent: function() {
			this.view.stopDragComponent();
		},
		
		selectComponent: function(component) {
			this.view.showSelectionBox(component);
		},
		
		unselectComponent: function() {
			this.view.hideSelectionBox();
		},
		
		resizeComponent: function(component) {
			this.view.resizeSelectionBox(component);
		}
	});
	return CanvasController;
});