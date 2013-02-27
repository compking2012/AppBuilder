ComponentFramework.ChocolateChipUI.View = ComponentFramework.ChocolateChipUI.UIComponent.extend({
	
	initialize: function() {
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
		this.isContainer = true;
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
		}
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
	}
}, {
	meta: {
		"name": "View",
		"type": "View",
		"cateogory": "UI",
		"icon": "images/jqm_page_icon.png",
		"defaultSize": {"width": "100%", "height": "100%"},
		"properties": [
			{
				"name": "BackgroundStyle",
				"type": "String",
				"description": "Background Style",
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
				}
			}  
		],
		"events": []
	}
});
