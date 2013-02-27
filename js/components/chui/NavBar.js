ComponentFramework.ChocolateChipUI.NavBar = ComponentFramework.ChocolateChipUI.UIComponent.extend({
	
	initialize: function() {
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
		this.isContainer = true;
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
		}
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
	}
}, {
	meta: {
		"name": "NavBar",
		"type": "NavBar",
		"cateogory": "UI",
		"icon": "images/jqm_header_icon.png",
		"defaultSize": {"width": "100%", "height": "36"},
		"properties": [
			{
				"name": "Title",
				"type": "String",
				"description": "Header Title",
				"defaultValue": "Header"
			}
		],
		"events": []
	}
});