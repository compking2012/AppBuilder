define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "views/SelectionBoxView", "text!views/CanvasView.html"
], function($, $ui, _, Backbone, MVC, SelectionBoxView, template) {
	var CanvasView = AppBuilder.View.extend({
		template: template,
		
		dropArea: null,
		device: null,
		screen: null,
		
		droppingComponent: null,
		selectionBox: null,
		
		events: {
			
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);

			this.device = this.getElement("#device");
			this.dropArea = this.getElement("#droparea");
			this.screen = this.getElement("#screen");
		},
		
		render: function() {
			this.$el.on("click", $.proxy(this.onClickCanvas, this));
			this.dropArea.droppable({
				greedy: true,
				tolerance: "pointer",
				activate: $.proxy(this.onDropActivate, this),
				deactivate: $.proxy(this.onDropDeactivate, this),
				over: $.proxy(this.onDropOver, this),
				out: $.proxy(this.onDropOut, this),
				drop: $.proxy(this.onDrop, this)
			});

			this.dropArea.mousemove($.proxy(this.onMouseMove, this));
			this.stopDragComponent();
		},
		
		onClickCanvas: function() {
			this.trigger("onUnselect");
		},
		
		onDropActivate: function(event, ui) {
			this.trigger("onDropActivate");
		},
		
		onDropDeactivate: function(event, ui) {
		    this.trigger("onDropDeactivate");
		},
		
		onDropOver: function(event, ui) {
		    this.trigger("onDropOver");
		},
		
		onDropOut: function(event, ui) {
		    this.trigger("onDropOut");
		},
		
		onDrop: function(event, ui) {
			var point = this.getMousePosition({left: event.pageX, top: event.pageY});
		    ui.helper.remove();
		    this.trigger("onDrop", this.droppingComponent, point);
		},
		
		onMouseMove: function(event, ui) {
			var point = this.getMousePosition({left: event.pageX, top: event.pageY});
		    //var triggerScrollYPos = this.dropArea.height() - 60;
		    this.trigger("onMouseMove", this.droppingComponent, point);
		},
		
		getMousePosition: function(point) {
		    var offset = this.screen.offset();
		    //var scrollTop = this.screen.get(0).contentWindow.pageYOffset;
		    return {left: point.left-offset.left, top: point.top-offset.top};
		},

		startDragComponent: function(component) {
			this.droppingComponent = component;
			var position = this.screen.position();
			this.dropArea.width(this.screen.width());
			this.dropArea.height(this.screen.height());
			this.dropArea.css("left", position.left);
			this.dropArea.css("top", position.top);
			this.dropArea.show();
		},
		
		stopDragComponent: function() {
			this.dropArea.hide();
			this.droppingComponent = null;
		},
		
		showSelectionBox: function(component) {
			var coord0 = this.screen.offset();
			var offset = component.getNodeOffset();
			var position = {
				left: coord0.left + offset.left,
				top: coord0.top + offset.top
			};
			var size = component.getNodeSize();
			
			this.hideSelectionBox();
			this.selectionBox = new SelectionBoxView(component.isResizable, position, size);
			this.selectionBox.on("onStartResize", $.proxy(this.onStartResize, this));
			this.selectionBox.pass("onResize", this);
			this.selectionBox.on("onStopResize", $.proxy(this.onStopResize, this));
			this.selectionBox.on("onStartMove", $.proxy(this.onStartMove, this));
			this.selectionBox.on("onMove", $.proxy(this.onMove, this));
			this.selectionBox.on("onStopMove", $.proxy(this.onStopMove, this));
			this.selectionBox.on("onSelect", $.proxy(this.onSelect, this));
			this.$el.append(this.selectionBox.$el);
			this.selectionBox.render();
		},
		
		hideSelectionBox: function() {
			if(this.selectionBox) {
				this.selectionBox.destroy();
				this.selectionBox = null;
			}
		},
		
		resizeSelectionBox: function(component) {
			var coord0 = this.screen.offset();
			var offset = component.getNodeOffset();
			var position = {
				left: coord0.left + offset.left,
				top: coord0.top + offset.top
			};
			var size = component.getNodeSize();
			this.selectionBox.resize(position, size);
		},
		
		onStartResize: function() {
			this.dropArea.droppable("disable");
			this.startDragComponent();
		},
		
		onStopResize: function(oldPosition, oldSize, newPosition, newSize) {
			this.dropArea.droppable("enable");
			this.stopDragComponent();
			this.trigger("onStopResize", oldPosition, oldSize, newPosition, newSize);
		},
		
		onSelect: function(event, ui) {
			this.trigger("onPointSelect", this.getMousePosition({left: event.pageX, top: event.pageY}));
			event.stopPropagation();
		},
		
		onStartMove: function(event, ui) {
			var point = this.getMousePosition({left: event.pageX, top: event.pageY});
			var position = this.getMousePosition(ui.offset);
			this.trigger("onStartSort", point, position);
		},
		
		onMove: function(event, ui) {
			var point = this.getMousePosition({left: event.pageX, top: event.pageY});
			var position = this.getMousePosition(ui.offset);
			this.trigger("onSort", point, position);
		},
		
		onStopMove: function(event, ui) {
			var point = this.getMousePosition({left: event.pageX, top: event.pageY});
			var position = this.getMousePosition(ui.offset);
			this.trigger("onStopSort", point, position);
		}
	});
	return CanvasView;
});