Namespace("ComponentFramework.Base");

Import("ComponentFramework.Base.Component");

ComponentFramework.Base.UIComponent = ComponentFramework.Base.Component.extend({

	initialize: function() {
		ComponentFramework.Component.prototype.initialize.call(this);
		this.parent = null;
		this.parentContainer = null;
		this.isContainer = false;
		this.children = [];
		this.node = null;
		
		this.left = 0;
		this.top = 0;
		this.width = 0;
		this.height = 0;
	},
	
	addChild: function(child, position) {
		if(!this.isContainer) {
			throw "addChild: Cannot add child if isContainer is false";
		}
		
		child.setParent(this);
		// Insert that element in the new position
		if(position == -1 || position > this.children.length-1) {
			this.children.push(child);
			this.container.append(child.node);
		}
		else {
			this.children.splice(position, 0, child);
			this.container.children(":eq(" + position + ")").before(child.node);
		}
	},
	
	removeChild: function(child) {
		if(!this.isContainer) {
			throw "removeChild: Cannot remove child if isContainer is false";
		}
		
		var foundPosition = -1;
		for(var i = 0; i < this.children.length; i++) {
			var item = this.children[i];
			if(item == child) {
				foundPosition = i;
				break;
			}
		}
		if(foundPosition < 0) {
			return -1;
		}

		// We found the child, remove that element from the array
		this.children.splice(foundPosition, 1);
		child.node.detach();
	},

	moveChild: function(child, position) {
		if(!this.isContainer) {
			throw "moveChild: Cannot move child if isContainer is false";
		}
		this.removeChild(child);
		this.addChild(child, position);
	},
	
	remove: function() {
		if(this.parent) {
			this.parent.removeChild(this);
		}
	},
	
	setParent: function(parent) {
		this.parent = parent;
	},
	
	getParent: function() {
		return this.parent;
	},
	
	getParentContainer: function() {
		return this.node.parent();
	},
	
	containsPoint: function(point) {
	    var offset = this.node.offset();
	    var width = this.node.outerWidth();
	    var height = this.node.outerHeight();
	    var margin = this.getCalculatedMargin();
	    if(margin.top < 0 && margin.right < 0) {
	    	// Check if we are inside the bounds, given the calculated margins
	    	if(point.x > (offset.left + width - margin.right) || point.x < (offset.left + margin.left) || 
	    		point.y > (offset.top + height) || point.y < offset.top) {
	    		return false;
	    	}
	    } 
	    else {
	    	if(point.x > (offset.left + width) || point.x < offset.left || point.y > (offset.top + height) || point.y < offset.top) {
	    		return false;
	    	}
	    }

	    return true;
	},
	
	getCalculatedMargin: function() {
		var ml = parseInt(this.node.css("marginLeft"));
		var pl = parseInt(this.node.css("paddingLeft"));
		var mt = parseInt(this.node.css("marginTop"));
		var pt = parseInt(this.node.css("paddingTop"));
		var mr = parseInt(this.node.css("marginRight"));
		var pr = parseInt(this.node.css("paddingRight"));
		var mb = parseInt(this.node.css("marginBottom"));
		var pb = parseInt(this.node.css("paddingBottom"));
		return {top: mt+pt, right: mr+pr, bottom: mb+pb, left: ml+pl};
	},

	refresh: function(object) {
	},
	
	bindEvents: function() {
		this.node.on("mousedown", $.proxy(this.onSelect, this));
	},
	
	onSelect: function(e) {
		if(this.container) {
			if(this.container.is(e.target)) {
				this.trigger("onSelect", this);
			}
			if(this.container.parentsUntil(this.node.parent()).is(e.target)) {
				this.trigger("onSelect", this);
			}
		}
		else {
			if(this.node.is(e.target)) {
				this.trigger("onSelect", this);
			}
		}
	}
}, {
	meta: null
});