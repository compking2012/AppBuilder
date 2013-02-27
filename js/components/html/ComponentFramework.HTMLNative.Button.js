Namespace("ComponentFramework.HTMLNative");

Import("ComponentFramework.HTMLNative.UIComponent");

ComponentFramework.HTMLNative.Button = ComponentFramework.HTMLNative.UIComponent.extend({
	
	initialize: function() {
		ComponentFramework.HTMLNative.UIComponent.prototype.initialize.call(this);
	},

	isAcceptable: function(parent) {
		//Only accept that parent is SubView object
		/*if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
			return false;
		}*/
		return ComponentFramework.HTMLNative.UIComponent.prototype.isAcceptable.call(this, parent);
	},
	
	generateUICode: function($mobile) {
		this.node = $mobile("<button type=\"button\"></button>");
		return this.node;
	},
	
	onPropertyChange: function(name, value) {
		if(name == "Type") {
			this.node.replaceWith("<input type=\"" + value + "\" />");
		}
		this.bindEvents();
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
	}
}, {
	meta: {
		"name": "Button",
		"type": "Button",
		"cateogory": "UI",
		"icon": "images/jqm_text_area_icon.png",
		"defaultSize": {"width": "100%", "height": "24"},
		"properties": [
			{
				"name": "Type",
				"type": "String",
				"description": "Button Type",
				"mapping": {
					"button": "Button",
					"submit": "Submit",
					"Reset": "Reset"
				}
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