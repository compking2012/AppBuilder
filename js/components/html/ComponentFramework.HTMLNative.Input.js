ComponentFramework.HTMLNative.Input = ComponentFramework.HTMLNative.UIComponent.extend({
	
	initialize: function() {
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
	},

	isAcceptable: function(parent) {
		//Only accept that parent is SubView object
		if(!parent instanceof ComponentFramework.ChocolateChipUI.SubView) {
			return false;
		}
		return ComponentFramework.ChocolateChipUI.UIComponent.prototype.isAcceptable.call(this, parent);
	},
	
	generateUICode: function($mobile) {
		this.node = $mobile("<input type=\"text\" />");
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
		"name": "Input",
		"type": "Input",
		"cateogory": "UI",
		"icon": "images/jqm_text_area_icon.png",
		"defaultSize": {"width": "100%", "height": "24"},
		"properties": [
			{
				"name": "Type",
				"type": "String",
				"description": "Input Type",
				"mapping": {
					"text": "Text",
					"email": "Email",
					"url": "URL",
					"password": "Password",
					"search": "Search",
					"tel": "Telephone",
					"number": "Number",
					"range": "Range"
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