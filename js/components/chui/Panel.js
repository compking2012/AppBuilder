ComponentFramework.ChocolateChipUI.Panel = ComponentFramework.ChocolateChipUI.UIComponent.extend({

	initialize: function() {
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
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
	}
}, {
	meta: {
		"name": "Panel",
		"type": "Panel",
		"cateogory": "UI",
		"icon": "images/jqm_footer_icon.png",
		"defaultSize": {"width": "100%", "height": "100%"},
		"properties": [
		],
		"events": []
	}
});	