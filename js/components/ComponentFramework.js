define([
	"jquery", "underscore", "backbone"
], function($, _, Backbone) {
	var ComponentFramework = {};
	
	//Base Class
	ComponentFramework.Component = Backbone.View.extend({

		properties: [],
		eventset: [],
		
		initialize: function() {
			this.id = -1;
			this.initPropertiesAndEvents(ComponentFramework.Component);
			this.on("onPropertyChange", $.proxy(this.onPropertyChange, this));
			this.on("onEventChange", $.proxy(this.onEventChange, this));
		},
		
		destroy: function() {
			//TODO: should be off events
			//this.off();
		},
		
		serialize: function() {
			return null;
		},
		
		deserialize: function(json) {
		},
		
		clone: function(component) {
			this.deserialize(component.serialize());
			return this;
		},
		
		equals: function(component) {
			return (this == component);
		},
		
		getClassInfo: function() {
			return this.classInfo;
		},
		
		initPropertiesAndEvents: function(myClass) {
			var properties = $.extend(true, [], myClass.prototype.constructor.meta.properties);
			var events = this.eventset.concat($.extend(true, [], myClass.prototype.constructor.meta.events));
			
			for(var i=0; i<properties.length; i++) {
				if(properties[i].defaultValue) {
					properties[i].value = properties[i].defaultValue;
				}
				else {
					if(properties[i].type == "String") {
						properties[i].value = "";
					}
					else if(properties[i].type == "Number"){
						properties[i].value = 0;
					}
					else if(properties[i].type == "Boolean") {
						properties[i].value = false;
					}
				}
			}
			for(var i=0; i<events.length; i++) {
				events[i].handler = null;
			}
			this.properties = this.properties.concat(properties);
			this.eventset = this.eventset.concat(events);
		},
		
		setPropertyValue: function(name, value) {
			for(var i=0; i<this.properties.length; i++) {
				var property = this.properties[i];
				if(property.name == name) {
					property.value = value;
					return;
				}
			}
		},
		
		getProperty: function(name) {
			var result = null;
			for(var i=0; i<this.properties.length; i++) {
				var property = this.properties[i];
				if(property.name == name) {
					result = property;
					return result;
				}
			}
			return null;
		},
		
		getProperties: function() {
			return this.properties;
		},
		
		getEvents: function() {
			return this.eventset;
		},
		
		setEventHandler: function(name, handler) {
			for(var i=0; i<this.eventset.length; i++) {
				var event = this.eventset[i];
				if(event.name == name) {
					event.handler = handler;
					return;
				}
			}
		},
		
		getType: function() {
			return this.constructor.meta.type;
		},
		
		getIcon: function() {
			return this.constructor.meta.icon;
		},
		
		getCateogory: function() {
			return this.constructor.meta.category;
		},
		
		isAcceptable: function(parent) {
			return true;
		},
		
		onPropertyChange: function(name, value) {
			if(name == "ID") {
				this.node.attr("id", value);
				this.setPropertyValue(name, value);
			}
		},
		
		onEventChange: function(name, handler) {
			this.setEventHandler(name, handler);
		},
		
		generateUICode: function($mobile) {
			return null;
		}
	}, {
		meta: {
			"name": "Component",
			"type": "Component",
			"cateogory": null,
			"icon": null,
			"properties": [
			    {
					"name": "ID",
					"type": "String",
					"description": "Component ID",
					"defaultValue": ""
				}
			]
		}
	});

	ComponentFramework.UIComponent = ComponentFramework.Component.extend({

		initialize: function() {
			ComponentFramework.Component.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.UIComponent);
			this.parent = null;
			this.parentContainer = null;
			this.isContainer = false;
			this.isResizable = true;
			this.children = [];
			this.node = null;
			this.container = null;
		},
		
		destroy: function() {
			this.remove();
			if(this.node) {
				this.node.off();
				this.node = null;
			}
			this.container = null;
			ComponentFramework.Component.prototype.destroy.call(this);
		},
		
		serialize: function() {
			var properties = [];
			$.each(this.properties, $.proxy(function(index, property) {
				if(property.defaultValue == undefined || property.value != property.defaultValue) {
					properties.push({
						name: property.name,
						value: property.value
					});
				}
			}, this));
			
			var events = [];
			$.each(this.eventset, $.proxy(function(index, event) {
				if(event.handler != null) {
					events.push({
						name: event.name,
						handler: event.handler
					});
				}
			}, this));
			
			var json = {
				id: 0,
				type: this.getType(),
				classInfo: this.getClassInfo(),
				properties: properties,
				events: events,
				children: []
			};
			return json;
		},
		
		deserialize: function(json) {
			this.id = json.id;
			this.type = json.type;
			this.classInfo = json.classInfo;
			$.each(json.properties, $.proxy(function(index, property) {
				this.onPropertyChange(property.name, property.value);
			}, this));
			
			$.each(json.events, $.proxy(function(index, event) {
				this.onEventChange(event.name, event.handler);
			}, this));
		},
		
		isNode: function(node) {
			if(this.container) {
				if(this.container.is(node)) {
					return true;
				}
				if(this.container.parentsUntil(this.node.parent()).is(node)) {
					return true;
				}
			}
			else {
				if(this.node.is(node) || this.node.has(node).length > 0) {
					return true;
				}
			}
			return false;
		},
		
		hasChild: function(child) {
			if(!this.isContainer) {
				return false;
			}
			return ($.inArray(child, this.children) >= 0);
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
		
		removeChild: function(child, dispose) {
			if(!this.isContainer) {
				throw "removeChild: Cannot remove child if isContainer is false";
			}
			
			var foundPosition = -1;
			for(var i = 0; i < this.children.length; i++) {
				var item = this.children[i];
				if(item.equals(child)) {
					foundPosition = i;
					break;
				}
			}
			if(foundPosition < 0) {
				return -1;
			}

			// We found the child, remove that element from the array
			this.children.splice(foundPosition, 1);
			if(dispose) {
				child.node.remove();
			}
			else {
				child.node.detach();
			}
		},

		moveChild: function(child, position) {
			if(!this.isContainer) {
				throw "moveChild: Cannot move child if isContainer is false";
			}
			child.getParent().removeChild(child, false);
			this.addChild(child, position);
		},
		
		remove: function() {
			if(this.parent) {
				this.parent.removeChild(this, true);
			}
		},
		
		getIndex: function() {
			if(this.getParent()) {
				return $.inArray(this, this.getParent().children);
			}
			else {
				return -1;
			}
		},
		
		getChildrenCount: function() {
			return this.children.length;
		},
		
		getChild: function(index) {
			return this.children[index];
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
		    var ml = parseInt(this.node.css("marginLeft"));
			var pl = parseInt(this.node.css("paddingLeft"));
			var mt = parseInt(this.node.css("marginTop"));
			var pt = parseInt(this.node.css("paddingTop"));
			var mr = parseInt(this.node.css("marginRight"));
			var pr = parseInt(this.node.css("paddingRight"));
			var mb = parseInt(this.node.css("marginBottom"));
			var pb = parseInt(this.node.css("paddingBottom"));
			var margin = {top: mt+pt, right: mr+pr, bottom: mb+pb, left: ml+pl};
		    if(margin.top < 0 && margin.right < 0) {
		    	// Check if we are inside the bounds, given the calculated margins
		    	if(point.left > (offset.left + width - margin.right) || point.left < (offset.left + margin.left) || 
		    		point.top > (offset.top + height) || point.top < offset.top) {
		    		return false;
		    	}
		    } 
		    else {
		    	if(point.left > (offset.left + width) || point.left < offset.left || point.top > (offset.top + height) || point.top < offset.top) {
		    		return false;
		    	}
		    }

		    return true;
		},
		
		refresh: function(object) {
		},
		
		setNodeCSS: function(name, value) {
			this.node.css(name, value);
		},
		
		getNodeOffset: function() {
			return this.node.offset();
		},
		
		getNodeSize: function() {
			return {width: this.node.outerWidth(), height: this.node.outerHeight()}; 
		},
		
		getNodeRect: function() {
			return {left: this.node.offset().left, top: this.node.offset().top, right: this.node.offset().left + this.node.outerWidth(), bottom: this.node.offset().top + this.node.outerHeight()};
		},
		
		bindEvents: function() {
			this.node.on("click", $.proxy(this.onSelect, this));
			this.node.on("scroll", $.proxy(this.onScroll, this));
		},
		
		onPropertyChange: function(name, value) {
			if(name == "Position") {
				if(value == "static") {
					this.node.css("position", "");
				}
				else {
					this.node.css("position", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Left") {
				if(value == "inherited") {
					this.node.css("left", "");
				}	
				else {
					this.node.css("left", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Top") {
				if(value == "inherited") {
					this.node.css("top", "");
				}
				else {
					this.node.css("top", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Right") {
				if(value == "inhertied") {
					this.node.css("right", "");
				}
				else {
					this.node.css("right", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Bottom") {
				if(value == "inhertied") {
					this.node.css("bottom", "");
				}
				else {
					this.node.css("bottom", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Width") {
				if(value == "inherited") {
					this.node.css("width", "");
				}
				else {
					this.node.css("width", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Height") {
				if(value == "inherited") {
					this.node.css("height", "");
				}
				else {
					this.node.css("height", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "MarginLeft") {
				if(value == "inherited") {
					this.node.css("margin-left", "");
				}
				else {
					this.node.css("margin-left", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "MarginTop") {
				if(value == "inherited") {
					this.node.css("margin-top", "");
				}
				else {
					this.node.css("margin-top", value);
				}				
				this.setPropertyValue(name, value);
			}
			else if(name == "MarginRight") {
				if(value == "inherited") {
					this.node.css("margin-right", "");
				}
				else {
					this.node.css("margin-right", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "MarginBottom") {
				if(value == "inherited") {
					this.node.css("margin-bottom", "");
				}
				else {
					this.node.css("margin-bottom", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "PaddingLeft") {
				if(value == "inherited") {
					this.node.css("padding-left", "");
				}
				else {
					this.node.css("padding-left", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "PaddingTop") {
				if(value == "inherited") {
					this.node.css("padding-top", "");
				}
				else {
					this.node.css("padding-top", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "PaddingRight") {
				if(value == "inherited") {
					this.node.css("padding-right", "");
				}
				else {
					this.node.css("padding-right", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "PaddingBottom") {
				if(value == "inherited") {
					this.node.css("padding-bottom", "");
				}
				else {
					this.node.css("padding-bottom", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Border") {
				if(value == "") {
					this.node.css("border", "");
				}
				else {
					this.node.css("border", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Outline") {
				if(value == "") {
					this.node.css("outline", "");
				}
				else {
					this.node.css("outline", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Float") {
				if(value == "none") {
					this.node.css("float", "");
				}
				else {
					this.node.css("float", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Overflow") {
				if(value == "visible") {
					this.node.css("overflow", "");
				}
				else {
					this.node.css("overflow", value);
				}
				this.setPropertyValue(name, value);
			}
			else {
				ComponentFramework.Component.prototype.onPropertyChange.call(this, name, value);
			}
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.Component.prototype.onEventChange.call(this, name, handler);
		},

		onSelect: function(e) {
			if(this.isNode(e.target)) {
				this.trigger("onSelect", this);
				e.stopPropagation();
			}
		},
		
		onScroll: function(e) {
			this.trigger("onScroll", this);
		}
	}, {
		meta: {
			"name": "UIComponent",
			"type": "UIComponent",
			"cateogory": null,
			"icon": null,
			"properties": [
			    {
            	    "name": "Position",
            	    "type": "String",
            	    "description": "Positioning type",
            	    "exclusive": true,
            	    "mapping": {
						"static": "Static",
						"absolute": "Absolute",
						"fixed": "Fixed",
						"relative": "Relative"
					},
					"defaultValue": "static"
			    },
			    {
            	    "name": "Left",
            	    "type": "Size",
            	    "description": "X-axis point from left side",
					"defaultValue": "inherited"
			    },
			    {
            	    "name": "Top",
            	    "type": "Size",
            	    "description": "Y-axis point from top side",
					"defaultValue": "inherited"
			    },
			    {
            	    "name": "Right",
            	    "type": "Size",
            	    "description": "X-axis point from right side",
					"defaultValue": "inherited"
			    },
			    {
            	    "name": "Bottom",
            	    "type": "Size",
            	    "description": "Y-axis point from bottom side",
					"defaultValue": "inherited"
			    	
			    },
		    	{
            	    "name": "Width",
            	    "type": "Size",
            	    "description": "Width",
					"defaultValue": "inherited"
		    	},
		    	{
            	    "name": "Height",
            	    "type": "Size",
            	    "description": "Height",
					"defaultValue": "inherited"
		    	},
		    	{
            	    "name": "MarginLeft",
            	    "type": "Size",
            	    "description": "Left margin",
					"defaultValue": "inherited"
		    	},
		    	{
            	    "name": "MarginTop",
            	    "type": "Size",
            	    "description": "Top margin",
					"defaultValue": "inherited"
		    	},		    	
		    	{
            	    "name": "MarginRight",
            	    "type": "Size",
            	    "description": "Right margin",
					"defaultValue": "inherited"
		    	},
		    	{
            	    "name": "MarginBottom",
            	    "type": "Size",
            	    "description": "Bottom margin",
					"defaultValue": "inherited"
		    	},
		    	{
            	    "name": "PaddingLeft",
            	    "type": "Size",
            	    "description": "Left padding",
            	    "defaultValue": "inherited"
		    	},
		    	{
            	    "name": "PaddingTop",
            	    "type": "Size",
            	    "description": "Top padding",
            	    "defaultValue": "inherited"
		    	},		    	
		    	{
            	    "name": "PaddingRight",
            	    "type": "Size",
            	    "description": "Right padding",
            	    "defaultValue": "inherited"
		    	},
		    	{
            	    "name": "PaddingBottom",
            	    "type": "Size",
            	    "description": "Bottom padding",
            	    "defaultValue": "inherited"
		    	},
		    	{
            	    "name": "Border",
            	    "type": "String",
            	    "description": "Border"
		    	},
		    	{
            	    "name": "Outline",
            	    "type": "String",
            	    "description": "Outline"
		    	},
		    	{
		    		"name": "Float",
		    		"type": "String",
		    		"description": "Whether float",
		    		"exclusive": true,
		    		"mapping": {
		    			"left": "Left",
		    			"right": "Right",
		    			"none": "None"
		    		},
		    		"defaultValue": "none"
		    	},
		    	{
		    		"name": "Overflow",
		    		"type": "String",
		    		"description": "Whether overflow",
		    		"exclusive": true,
		    		"mapping": {
		    			"visible": "Visible",
		    			"auto": "Auto",
		    			"hidden": "Hidden",
		    			"scroll": "Scroll",
			    		"inherit": "Inherit"
		    		},
		    		"defaultValue": "visible"
		    	}
		    ]
		}
	});

	ComponentFramework.ServiceComponent = ComponentFramework.Component.extend({
		
	});
	
	//ChocolateChip UI Components
	ComponentFramework.ChocolateChipUI = {};
	ComponentFramework.ChocolateChipUI.UIComponent = ComponentFramework.UIComponent.extend({

		initialize: function() {
			ComponentFramework.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.UIComponent);
		}
	}, {
		meta: {
			"name": "ChocolateChipUI.UIComponent",
			"type": "ChocolateChipUI.UIComponent",
			"cateogory": null,
			"icon": null,
			"properties": []
		}
	});
	
	ComponentFramework.ChocolateChipUI.View = ComponentFramework.ChocolateChipUI.UIComponent.extend({

		initialize: function() {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.View);
			this.isContainer = true;
			this.isResizable = false;
		},
		
		isAcceptable: function(parent) {
			//Only accept that parent is <app> top object
			if(parent != null) {
				return false;
			}
			return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<view></view>");
			this.container = this.node;
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			if(name == "BackgroundStyle") {
				if(value == "normal") {
					this.node.removeAttr("ui-background-style");
				}
				else {
					this.node.attr("ui-background-style", value);
				}
				this.setPropertyValue(name, value);
			}
			else {
				ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
			}
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onEventChange.call(this, name, handler);
		}
	}, {
		meta: {
			"name": "View",
			"type": "View",
			"cateogory": "UI",
			"icon": "images/jqm_page_icon.png",
			"properties": [
				{
					"name": "BackgroundStyle",
					"type": "String",
					"description": "Background Style",
					"exclusive": true,
					"mapping": {
						"normal": "Normal",
						"striped": "Striped",
						"vertical-striped": "Vertical Striped",
						"horizontal-striped": "Horizontal Striped",
						"slanted-left": "Slanted Left",
						"slanted-right": "Slanted Right",
						"squared": "Squared",
						"checkered": "Checkered",
						"chess": "Chess",
						"speckled": "Speckled",
						"spotted": "Spotted"
					},
					"defaultValue": "normal"
				}
			],
			"events": []
		}
	});
	
	ComponentFramework.ChocolateChipUI.NavBar = ComponentFramework.ChocolateChipUI.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.NavBar);
			this.isContainer = true;
			this.isResizable = false;
		},

		isAcceptable: function(parent) {
			//Only accept that parent is View object
			if(!(parent instanceof ComponentFramework.ChocolateChipUI.View)) {
				return false;
			}
			return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			var value = this.getProperty("Title").value;
			this.node = $mobile("<navbar><h1>" + value + "</h1></navbar>");
			this.container = this.node;
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			if(name == "Title") {
				this.node.find("h1").html(value);
				this.setPropertyValue(name, value);
			}
			else if(name == "FontColor") {
				this.node.find("h1").css("color", value);
				this.setPropertyValue(name, value);
			}
			else {
				ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
			}
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "NavBar",
			"type": "NavBar",
			"cateogory": "UI",
			"icon": "images/jqm_navbar_icon.png",
			"properties": [
				{
					"name": "Title",
					"type": "String",
					"description": "Header Title",
					"defaultValue": "Header"
				},
				
			],
			"events": []
		}
	});
	
	ComponentFramework.ChocolateChipUI.ToolBar = ComponentFramework.ChocolateChipUI.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.ToolBar);
			this.isContainer = true;
			this.isResizable = false;
		},
		
		isAcceptable: function(parent) {
			//Only accept that parent is View object
			if(!(parent instanceof ComponentFramework.ChocolateChipUI.View)) {
				return false;
			}
			return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<toolbar></toolbar>");
			this.container = this.node;
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			if(name == "Placement") {
				if(value == "normal") {
					this.node.removeAttr("ui-placement");
				}
				else {
					this.node.attr("ui-placement", value);
				}
				this.setPropertyValue(name, value);
			}
			else {
				ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange(this, name, value);
			}
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "ToolBar",
			"type": "ToolBar",
			"cateogory": "UI",
			"icon": "images/jqm_footer_icon.png",
			"properties": [
				{
					"name": "Placement",
					"type": "String",
					"description": "Placement",
					"exclusive": true,
					"mapping": {
						"normal": "Normal",
						"top": "Top",
						"bottom": "Bottom"
					},
					"defaultValue": "normal"
				}
			],
			"events": []
		}
	});
	
	ComponentFramework.ChocolateChipUI.TabBar = ComponentFramework.ChocolateChipUI.UIComponent.extend({

		initialize: function() {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.TabBar);
			this.isContainer = true;
			this.isResizable = false;
		},

		isAcceptable: function(parent) {
			//Only accept that parent is View object
			if(!(parent instanceof ComponentFramework.ChocolateChipUI.View)) {
				return false;
			}
			return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<tabbar></tabbar>");
			this.container = this.node;
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onEventChange.call(this, name, handler);
		}
	}, {
		meta: {
			"name": "TabBar",
			"type": "TabBar",
			"cateogory": "UI",
			"icon": "images/jqm_footer_icon.png",
			"properties": [
			],
			"events": []
		}
	});	
	
	ComponentFramework.ChocolateChipUI.SubView = ComponentFramework.ChocolateChipUI.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.SubView);
			this.isContainer = true;
			this.isResizable = false;
		},
		
		isAcceptable: function(parent) {
			//Only accept that parent is View object
			if(!(parent instanceof ComponentFramework.ChocolateChipUI.View)) {
				return false;
			}
			return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<subview><scrollpanel></scrollpanel></subview>");
			this.container = $mobile("scrollpanel", this.node);
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			if(name == "Associations") {
				if(value == "") {
					this.node.removeAttr("ui-associations");
				}
				else {
					this.node.attr("ui-associations", value);
				}
				this.setPropertyValue(name, value);
			}
			else {
				ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
			}
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "SubView",
			"type": "SubView",
			"cateogory": "UI",
			"icon": "images/jqm_footer_icon.png",
			"properties": [
				{
					"name": "Associations",
					"type": "String",
					"description": "UI Associations",
					"multiSelect": true,
					"mapping": {
						"withNavBar": "With NavBar",
						"withTopToolBar": "With Top ToolBar",
						"withBottomToolBar": "With Bottom ToolBar"
					},
					"defaultValue": "withNavBar withBottomToolBar"
				}
			],
			"events": []
		}
	});
	
	ComponentFramework.ChocolateChipUI.Panel = ComponentFramework.ChocolateChipUI.UIComponent.extend({

		initialize: function() {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.Panel);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is Page object
			if(!(parent instanceof ComponentFramework.ChocolateChipUI.SubView)) {
				return false;
			}
			return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<panel></panel>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Panel",
			"type": "Panel",
			"cateogory": "UI",
			"icon": "images/jqm_footer_icon.png",
			"properties": [
			],
			"events": []
		}
	});	

	ComponentFramework.ChocolateChipUI.Button = ComponentFramework.ChocolateChipUI.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.Button);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			if(!(parent instanceof ComponentFramework.ChocolateChipUI.SubView || 
					parent instanceof ComponentFramework.ChocolateChipUI.NavBar ||
					parent instanceof ComponentFramework.ChocolateChipUI.ToolBar ||
					parent instanceof ComponentFramework.ChocolateChipUI.TabBar ||
					parent instanceof ComponentFramework.ChocolateChipUI.SegmentedControl)) {
				return false;
			}
			return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			var value = this.getProperty("Label").value;
			this.node = $mobile("<uibutton><label>" + value + "</label></uibutton>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			if(name == "Label") {
				this.node.find("label").html(value);
				this.setPropertyValue(name, value);
			}
			else if(name == "Icon") {
				if(value != "") {
					if(this.node.find("icon").length > 0) {
						this.node.find("icon").attr("style", "-webkit-mask-image: url(" + value + ")");
					}
					else {
						this.node.prepend($("<icon></icon>").attr("style", "-webkit-mask-image: url(" + value + ")"));
					}
				}
				else {
					this.node.find("icon").remove();
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "IconAlignment") {
				this.node.attr("ui-icon-align", value);
				this.setPropertyValue(name, value);
			}
			else if(name == "Type") {
				if(value == "normal") {
					this.node.removeAttr("ui-implements");
				}
				else {
					this.node.attr("ui-implements", value);
				}
				this.setPropertyValue(name, value);
			}
			else if(name == "Style") {
				if(value == "normal") {
					this.node.removeAttr("ui-kind");
				}
				else {
					this.node.attr("ui-kind", value);
				}
				this.setPropertyValue(name, value);
			}
			else {
				ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
			}
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onEventChange.call(this, name, handler);
		}
	}, {
		meta: {
			"name": "Button",
			"type": "Button",
			"cateogory": "UI",
			"icon": "images/jqm_button_icon.png",
			"properties": [
				{
					"name": "Label",
					"type": "String",
					"description": "Button title",
					"defaultValue": "Button"
				},
				{
					"name": "Icon",
					"type": "String",
					"description": "Button icon",
					"exclusive": false,
					"mapping": {
						"js/libs/chui/icons/add.svg": "Add" ,
						"js/libs/chui/icons/arrow_up.svg": "Arrow Up",
						"js/libs/chui/icons/action.svg": "Action",
						"js/libs/chui/icons/add_black.svg": "Add Black",
						"js/libs/chui/icons/arrow_down.svg": "Arrow Down",
						"js/libs/chui/icons/arrow_left.svg": "Arrow Left",
						"js/libs/chui/icons/arrow_right.svg": "Arrow Right",
						"js/libs/chui/icons/arrow_attachement.svg": "Attachment",
						"js/libs/chui/icons/bag.svg": "Bag",
						"js/libs/chui/icons/bookmarks.svg": "Bookmarks",
						"js/libs/chui/icons/cabinet.svg": "Cabinet",
						"js/libs/chui/icons/chart.svg": "Chart",
						"js/libs/chui/icons/chat.svg": "Chat",
						"js/libs/chui/icons/check_mark.svg": "Check Mark",
						"js/libs/chui/icons/chevron.svg": "Chevron",
						"js/libs/chui/icons/cog.svg": "Cog",
						"js/libs/chui/icons/compose.svg": "Compose",
						"js/libs/chui/icons/contacts.svg": "Contacts",
						"js/libs/chui/icons/delete_check_mark.svg": "Delete Check Mark",
						"js/libs/chui/icons/delete.svg": "Delete",
						"js/libs/chui/icons/download.svg": "Download",
						"js/libs/chui/icons/downloads.svg": "Downloads",
						"js/libs/chui/icons/eye.svg": "Eye",
						"js/libs/chui/icons/files.svg": "Files",
						"js/libs/chui/icons/film.svg": "Film",
						"js/libs/chui/icons/flag.svg": "Flag",
						"js/libs/chui/icons/gift.svg": "Gift",
						"js/libs/chui/icons/heart.svg": "Heart",
						"js/libs/chui/icons/history.svg": "History",
						"js/libs/chui/icons/home.svg": "Home",
						"js/libs/chui/icons/id_card.svg": "ID Card",
						"js/libs/chui/icons/info.svg": "Info",
						"js/libs/chui/icons/location_pin.svg": "Location Pin",
						"js/libs/chui/icons/more.svg": "More",
						"js/libs/chui/icons/move-indicator.svg": "Move Indicator",
						"js/libs/chui/icons/refresh.svg": "Refresh",
						"js/libs/chui/icons/reload.svg": "Reload",
						"js/libs/chui/icons/search.svg": "Search",
						"js/libs/chui/icons/settings.svg": "Settings",
						"js/libs/chui/icons/shopping-cart.svg": "Shopping Cart",
						"js/libs/chui/icons/todo.svg": "Todo",
						"js/libs/chui/icons/top_rated.svg": "Top Rated",
						"js/libs/chui/icons/apple_logo.svg": "Apple Logo",
						"js/libs/chui/icons/droid_logo.svg": "Droid Logo"
					},
					"defaultValue": ""
				},
				{
					"name": "IconAlignment",
					"type": "String",
					"description": "Icon alignment",
					"exclusive": true,
					"mapping": {
						"top": "Top",
						"bottom": "Bottom",
						"left": "Left",
						"right": "Right"
					},
					"defaultValue": "left"
				},
				{
					"name": "Type",
					"type": "String",
					"description": "Button Type",
					"exclusive": true,
					"mapping": {
						"normal": "Normal",
						"back": "Back",
						"next": "Next",
						"done": "Done",
						"cancel": "Cancel",
						"icon": "Icon only"
					},
					"defaultValue": "normal"
				},
				{
					"name": "Style",
					"type": "String",
					"description": "Button Style",
					"exclusive": true,
					"mapping": {
						"normal": "Normal",
						"rounded-rectangle": "Rounded Rectangle",
						"action": "Action",
						"icon": "Icon"
					}
				}
			],
			"events": [
			    {
			    	"name": "Click",
				    "description": "Mouse Click event",
			    	"domEvent": "click"
			    }
			]
		}
	});
	
	ComponentFramework.ChocolateChipUI.SwitchControl = ComponentFramework.ChocolateChipUI.UIComponent.extend({

		initialize: function() {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.SwitchControl);
			this.isResizable = false;
		},

		isAcceptable: function(parent) {
			//Only accept that parent is Page object
			if(!(parent instanceof ComponentFramework.ChocolateChipUI.SubView)) {
				return false;
			}
			return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<switchcontrol class=\"on\"><thumb></thumb><input type=\"checkbox\" /></switchcontrol>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "SwitchControl",
			"type": "SwitchControl",
			"cateogory": "UI",
			"icon": "images/jqm_toggle_switch.png",
			"properties": [
				{
					"name": "Style",
					"type": "String",
					"description": "Switch Style",
					"exclusive": true,
					"mapping": {
						"tranditional": "Tranditional",
						"new": "New iOS 5"
					},
					"defaultValue": "new"
				},
				{
					"name": "State",
					"type": "String",
					"description": "Switch State",
					"exclusive": true,
					"mapping": {
						"on": "ON",
						"off": "OFF"
					},
					"defaultValue": "on"
				}
			],
			"events": []
		}
	});	
	
	ComponentFramework.ChocolateChipUI.SegmentedControl = ComponentFramework.ChocolateChipUI.UIComponent.extend({

		initialize: function() {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.ChocolateChipUI.SegmentedControl);
			this.isContainer = true;
			this.isResizable = false;
		},

		isAcceptable: function(parent) {
			//Only accept that parent is View object
			if(!(parent instanceof ComponentFramework.ChocolateChipUI.View ||
					parent instanceof ComponentFramework.ChocolateChipUI.NavBar ||
					parent instanceof ComponentFramework.ChocolateChipUI.ToolBar)) {
				return false;
			}
			return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<segmentedcontrol style=\"width:100px;height:24px;\"></segmentedcontrol>");
			this.container = this.node;
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.ChocolateChipUI.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "SegmentedControl",
			"type": "SegmentedControl",
			"cateogory": "UI",
			"icon": "images/jqm_footer_icon.png",
			"properties": [
			],
			"events": []
		}
	});	
	
	ComponentFramework.HTMLNative = {};
	ComponentFramework.HTMLNative.UIComponent = ComponentFramework.UIComponent.extend({
		initialize: function() {
			ComponentFramework.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.UIComponent);
		}
	}, {
		meta: {
			"name": "HTMLNative.UIComponent",
			"type": "HTMLNative.UIComponent",
			"cateogory": null,
			"icon": null,
			"properties": []
		}		
	});
	
	ComponentFramework.HTMLNative.Button = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Button);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			var value = this.getProperty("Label").value;
			this.node = $mobile("<button>" + value + "</button>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			if(name == "Label") {
				this.node.html(value);
				this.setPropertyValue(name, value);
			}
			else {
				ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
			}
		},

		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}
	}, {
		meta: {
			"name": "Button",
			"type": "Button",
			"cateogory": "UI",
			"icon": "images/jqm_button_icon.png",
			"properties": [
				{
					"name": "Label",
					"type": "String",
					"description": "Button title",
					"defaultValue": "Button"
				},
				{
					"name": "Type",
					"type": "String",
					"description": "Button Type",
					"exclusive": true,
					"mapping": {
						"button": "Button",
						"submit": "Submit",
						"Reset": "Reset"
					}
				}
			],
			"events": [
			    {
			    	"name": "Click",
				    "description": "Mouse Click event",
			    	"domEvent": "click"
			    }
			]
		}
	});
	
	ComponentFramework.HTMLNative.Input = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Input);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<input type=\"text\" />");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			if(name == "Type") {
				if(this.node.attr("type") != value) {
					this.node[0].type = value;
				}
				this.setPropertyValue(name, value);
			}
			else {
				ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
			}
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Input",
			"type": "Input",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
				{
					"name": "Type",
					"type": "String",
					"description": "Input Type",
					"exclusive": true,
					"mapping": {
						"text": "Text",
						"email": "Email",
						"url": "URL",
						"password": "Password",
						"search": "Search",
						"tel": "Telephone",
						"number": "Number",
						"range": "Range"
					},
					"defaultValue": "text"
				}
			],
			"events": [
			    {
			    	"name": "KeyDown",
				    "description": "KeyDown event",
			    	"domEvent": "keydown"
			    },
			    {
			    	"name": "KeyUp",
				    "description": "KeyUp event",
			    	"domEvent": "keyup"
			    },
			    {
			    	"name": "KeyPress",
				    "description": "KeyPress event",
			    	"domEvent": "keypress"
			    }
			]
		}
	});	

	ComponentFramework.HTMLNative.TextArea = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.TextArea);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<textarea></textarea>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "TextArea",
			"type": "TextArea",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});
	
	ComponentFramework.HTMLNative.Select = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Select);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<select></select>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Select",
			"type": "Select",
			"cateogory": "UI",
			"icon": "images/jqm_button_icon.png",
			"properties": [
				{
					"name": "Options",
					"type": "List",
					"description": "Option list",
					"list": [
					    {
					    	"name": "abc",
					    	"value": "ABC"
					    }
					]
				}
			],
			"events": [
			]
		}
	});	
	
	ComponentFramework.HTMLNative.Image = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Image);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<img></img>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Image",
			"type": "Image",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});	
	
	ComponentFramework.HTMLNative.Anchor = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Anchor);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<a></a>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Anchor",
			"type": "Anchor",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});
	
	ComponentFramework.HTMLNative.Division = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Division);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<div></div>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Division",
			"type": "Division",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});	
	
	ComponentFramework.HTMLNative.Span = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Span);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			var value = this.getProperty("Label").value;
			this.node = $mobile("<span>" + value + "</span>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			if(name == "Label") {
				this.node.html(value);
				this.setPropertyValue(name, value);
			}
			else if(name == "FontSize") {
				this.node.css("font-size", value);
				this.setPropertyValue(name, value);
			}
			else if(name == "FontColor") {
				this.node.css("color", value);
				this.setPropertyValue(name, value);
			}
			else {
				ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
			}
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Span",
			"type": "Span",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
				{
					"name": "Label",
					"type": "String",
					"description": "Span content",
					"defaultValue": "Span"
				},
		    	{
		    		"name": "FontSize",
		    		"type": "Size",
		    		"description": "Font size",
		    		"defaultValue": "auto"
		    	},
		    	{
		    		"name": "FontColor",
		    		"type": "Color",
		    		"descrition": "Font Color",
		    		"defaultValue": "black"
		    	}				
			],
			"events": [
			]
		}
	});	
	
	ComponentFramework.HTMLNative.Table = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Table);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<table></table>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Table",
			"type": "Table",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});	
	
	ComponentFramework.HTMLNative.Form = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Form);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<form></form>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Form",
			"type": "Form",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});	
		
	ComponentFramework.HTMLNative.List = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.List);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<ul></ul>");	//TODO: decide ol/ul by default value
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "List",
			"type": "List",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});		
	
	ComponentFramework.HTMLNative.Video = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Video);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<video></video>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Video",
			"type": "Video",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});	
	
	ComponentFramework.HTMLNative.Audio = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Audio);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<audio></audio>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Audio",
			"type": "Audio",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});	
	
	ComponentFramework.HTMLNative.Canvas = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.Canvas);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<canvas></canvas>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "Canvas",
			"type": "Canvas",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});	
	
	ComponentFramework.HTMLNative.IFrame = ComponentFramework.HTMLNative.UIComponent.extend({
		
		initialize: function() {
			ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
			this.initPropertiesAndEvents(ComponentFramework.HTMLNative.IFrame);
		},

		isAcceptable: function(parent) {
			//Only accept that parent is SubView object
			/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
				return false;
			}*/
			return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
		},
		
		generateUICode: function($mobile) {
			this.node = $mobile("<iframe></iframe>");
			return this.node;
		},
		
		onPropertyChange: function(name, value) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onPropertyChange.call(this, name, value);
		},
		
		onEventChange: function(name, handler) {
			ComponentFramework.HTMLNative.UIComponent.prototype.onEventChange.call(this, name, handler);
		}		
	}, {
		meta: {
			"name": "IFrame",
			"type": "IFrame",
			"cateogory": "UI",
			"icon": "images/jqm_text_area_icon.png",
			"properties": [
			],
			"events": [
			]
		}
	});		
	return ComponentFramework;
});

