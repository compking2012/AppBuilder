ComponentFramework.ChocolateChipUI.Button = ComponentFramework.ChocolateChipUI.UIComponent.extend({
	
	initialize: function() {
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.initialize.call(this);
	},

	isAcceptable: function(parent) {
		//Only accept that parent is SubView object
		if(!(parent instanceof ComponentFramework.ChocolateChipUI.SubView)) {
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
		}
		else if(name == "Icon") {
			if(this.node.find("icon").length > 0) {
				this.node.find("icon").attr("style", "-webkit-mask-image: url(" + value + ")");
			}
			else {
				this.node.prepend($("<icon></icon>").attr("style", "-webkit-mask-image: url(" + value + ")"));
			}
		}
		else if(name == "IconAlignment") {
			this.node.attr("ui-icon-align", value);
		}
		else if(name == "Type") {
			if(value == "normal") {
				this.node.removeAttr("ui-implements");
			}
			else {
				this.node.attr("ui-implements", value);
			}
		}
		else if(name == "Style") {
			if(value == "normal") {
				this.node.removeAttr("ui-kind");
			}
			else {
				this.node.attr("ui-kind", value);
			}
		}
		ComponentFramework.ChocolateChipUI.UIComponent.prototype.onPropertyChange.call(this, name, value);
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
		"defaultSize": {"width": "100%", "height": "24"},
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
				}
			},
			{
				"name": "IconAlignment",
				"type": "String",
				"description": "Icon alignment",
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
				"mapping": {
					"normal": "Normal",
					"back": "Back",
					"next": "Next",
					"icon": "Icon only"
				}
			},
			{
				"name": "Style",
				"type": "String",
				"description": "Button Style",
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