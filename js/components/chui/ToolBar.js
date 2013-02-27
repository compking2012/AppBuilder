ComponentFramework.ChocolateChipUI.ToolBar = ComponentFramework.ChocolateChipUI.UIComponent.extend({
	
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
		this.node = $mobile("<toolbar ui-placement=\"bottom\"></toolbar>");
		this.container = this.node;
		return this.node;
	},
	
	onPropertyChange: function(name, value) {
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange(this, name, value);
	}
}, {
	meta: {
		"name": "ToolBar",
		"type": "ToolBar",
		"cateogory": "UI",
		"icon": "images/jqm_footer_icon.png",
		"defaultSize": {"width": "100%", "height": "36"},
		"properties": [
		],
		"events": []
	}
});