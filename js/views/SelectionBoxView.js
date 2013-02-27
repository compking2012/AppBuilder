define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", 
    "text!views/SelectionBoxView.html"
], function($, $ui, _, Backbone, MVC, template) {
	var SelectionBoxView = AppBuilder.View.extend({
		template: template,
		
		resizable: false,
		position: null,
		size: null,
		startPosition: null,
		lastPosition: null,
		
		events: {
			
		},
		
		initialize: function(resizable, position, size) {
			AppBuilder.View.prototype.initialize.call(this);
			this.resizable = resizable;
			this.position = position;
			this.size = size;
		},
		
		render: function() {
			this.$el.on("click", $.proxy(this.onClick, this));
			this.$el.draggable({
				iframeFix: true,
				cursor: "move",
				start: $.proxy(this.onStartDragBox, this),
				stop: $.proxy(this.onStopDragBox, this),
				drag: $.proxy(this.onDragBox, this)
			});
			
			this.northwest = this.getElement(".northwest");
			this.northeast = this.getElement(".northeast");
			this.southwest = this.getElement(".southwest");
			this.southeast = this.getElement(".southeast");
			this.north = this.getElement(".north");
			this.south = this.getElement(".south");
			this.west = this.getElement(".west");
			this.east = this.getElement(".east");
			if(this.resizable) {
				this.northwest.draggable({
					iframeFix: true,
					cursor: "nw-resize",
					start: $.proxy(this.onStartDragPoint, this),
					stop: $.proxy(this.onStopDragPoint, this),
					drag: $.proxy(this.onDragNorthWest, this)
				});
				this.north.draggable({
					iframeFix: true,
					cursor: "n-resize",
					axis: "y",
					start: $.proxy(this.onStartDragPoint, this),
					stop: $.proxy(this.onStopDragPoint, this),
					drag: $.proxy(this.onDragNorth, this)
				});
				this.northeast.draggable({
					iframeFix: true,
					cursor: "ne-resize",
					start: $.proxy(this.onStartDragPoint, this),
					stop: $.proxy(this.onStopDragPoint, this),
					drag: $.proxy(this.onDragNorthEast, this)
				});
				this.west.draggable({
					iframeFix: true,
					cursor: "w-resize",
					axis: "x",
					start: $.proxy(this.onStartDragPoint, this),
					stop: $.proxy(this.onStopDragPoint, this),
					drag: $.proxy(this.onDragWest, this)
				});
				this.east.draggable({
					iframeFix: true,
					cursor: "e-resize",
					axis: "x",
					start: $.proxy(this.onStartDragPoint, this),
					stop: $.proxy(this.onStopDragPoint, this),
					drag: $.proxy(this.onDragEast, this)
				});
				this.southwest.draggable({
					iframeFix: true,
					cursor: "sw-resize",
					start: $.proxy(this.onStartDragPoint, this),
					stop: $.proxy(this.onStopDragPoint, this),
					drag: $.proxy(this.onDragSouthWest, this)
				});
				this.south.draggable({
					iframeFix: true,
					cursor: "s-resize",
					axis: "y",
					start: $.proxy(this.onStartDragPoint, this),
					stop: $.proxy(this.onStopDragPoint, this),
					drag: $.proxy(this.onDragSouth, this)
				});
				this.southeast.draggable({
					iframeFix: true,
					cursor: "se-resize",
					start: $.proxy(this.onStartDragPoint, this),
					stop: $.proxy(this.onStopDragPoint, this),
					drag: $.proxy(this.onDragSouthEast, this)
				});
			}
			this.renderPoints(this.position, this.size);
		},
		
		renderPoints: function(position, size) {
			this.$el.offset({
				left: position.left,
				top: position.top
			});
			this.$el.css("width", size.width);
			this.$el.css("height", size.height);
			
			this.northwest.css("left", -this.north.outerWidth()/2);
			this.northwest.css("top", -this.north.outerHeight()/2);
			this.north.css("left", size.width/2 - this.north.outerWidth()/2);
			this.north.css("top", -this.north.outerHeight()/2);
			this.northeast.css("left", size.width - this.northeast.outerWidth()/2);
			this.northeast.css("top", -this.northeast.outerHeight()/2);
			this.west.css("left", -this.west.outerWidth()/2);
			this.west.css("top", size.height/2 - this.west.outerHeight()/2);
			this.east.css("left", size.width - this.east.outerWidth()/2);
			this.east.css("top", size.height/2 - this.east.outerHeight()/2);
			this.southwest.css("left", -this.southwest.outerWidth()/2);
			this.southwest.css("top", size.height - this.southwest.outerHeight()/2);
			this.south.css("left", size.width/2 - this.south.outerWidth()/2);
			this.south.css("top", size.height - this.south.outerHeight()/2);
			this.southeast.css("left", size.width - this.southeast.outerWidth()/2);
			this.southeast.css("top", size.height - this.southeast.outerHeight()/2);
		},
		
		onClick: function(event) {
			this.trigger("onSelect", event);
		},
		
		onStartDragBox: function(event, ui) {
			this.trigger("onStartMove", event, ui);
		},
		
		onDragBox: function(event, ui) {
			this.trigger("onMove", event, ui);
		},
		
		onStopDragBox: function(event, ui) {
			this.trigger("onStopMove", event, ui);
		},
		
		onStartDragPoint: function(event, ui) {
			this.startPosition = this.getCenterPoint($(event.target));
			this.trigger("onStartResize");
		},
		
		onStopDragPoint: function(event, ui) {
			var oldPosition = this.position;
			var oldSize = this.size;
			var newPosition = this.position;
			var newSize = {
				width: this.size.width + (this.lastPosition.left - this.startPosition.left),
				height: this.size.height + (this.lastPosition.top - this.startPosition.top)
			
			};
			this.position = newPosition;
			this.size = newSize;
			this.renderPoints(newPosition, newSize);
			this.trigger("onStopResize", oldPosition, oldSize, newPosition, newSize);
		},
		
		onDragNorthWest: function(event, ui) {
			this.drag("northwest", this.getCenterPoint(this.northwest));
		},
		
		onDragNorth: function(event, ui) {
			this.drag("north", this.getCenterPoint(this.north));
		},
		
		onDragNorthEast: function(event, ui) {
			this.drag("northeast", this.getCenterPoint(this.northeast));
		},
		
		onDragWest: function(event, ui) {
			this.drag("west", this.getCenterPoint(this.west));
		},
		
		onDragEast: function(event, ui) {
			this.drag("east", this.getCenterPoint(this.east));
		},
		
		onDragSouthWest: function(event, ui) {
			this.drag("southwest", this.getCenterPoint(this.southwest));
		},
		
		onDragSouth: function(event, ui) {
			this.drag("south", this.getCenterPoint(this.south));
		},
		
		onDragSouthEast: function(event, ui) {
			this.drag("southeast", this.getCenterPoint(this.southeast));
		},
		
		getCenterPoint: function(node) {
			var position = node.position();
			var size = {width: node.outerWidth(), height: node.outerHeight()};
			return {left: position.left + size.width/2, top: position.top + size.height/2};
		},
		
		drag: function(direction, position) {
			var newPosition = this.position;
			if(direction == "northwest" || direction == "north" || direction == "northeast" || direction == "west" || direction == "southwest") {
				newPosition = {
					left: this.position.left + (position.left - this.startPosition.left),
					top: this.position.top + (position.top - this.startPosition.top)
				};
			};
			var newSize = {
				width: this.size.width + (position.left - this.startPosition.left),
				height: this.size.height + (position.top - this.startPosition.top)
			
			};
			this.lastPosition = position;
			this.renderPoints(newPosition, newSize);
			this.trigger("onResize", newPosition, newSize);
		},
		
		resize: function(position, size) {
			this.renderPoints(position, size);
		}
	});
	return SelectionBoxView;
});