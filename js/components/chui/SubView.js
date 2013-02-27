ComponentFramework.ChocolateChipUI.SubView = ComponentFramework.ChocolateChipUI.UIComponent.extend({
	
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
		this.node = $mobile("<subview><scrollpanel></scrollpanel></subview>");
		this.container = $mobile("scrollpanel", this.node);
		this.node.attr("ui-associations", "withNavBar");
		return this.node;
	},
	
	onPropertyChange: function(name, value) {
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
	}
}, {
	meta: {
		"name": "SubView",
		"type": "SubView",
		"cateogory": "UI",
		"icon": "images/jqm_footer_icon.png",
		"defaultSize": {"width": "100%", "height": "100%"},
		"properties": [
		],
		"events": []
	}
});