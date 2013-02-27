//UI Components
ComponentFramework.JQueryMobile = {};
ComponentFramework.JQueryMobile.UIComponent = ComponentFramework.UIComponent.extend({
	refresh: function($mobile) {
		if($mobile.mobile.activePage) {
			$mobile.mobile.activePage.trigger("create");
		}
	}
});

ComponentFramework.JQueryMobile.Page = ComponentFramework.JQueryMobile.UIComponent.extend({
	isContainer: true,

	generateUICode: function(parentNode, $mobile) {
		this.node = $mobile("<div data-role=\"page\"></div>");
		parentNode.append(this.node);
		this.node.page();
		this.refresh($mobile);
	},
	
	refresh: function($mobile) {
		$mobile("html").addClass("ui-mobile");
		$mobile.mobile.initializePage();
		$mobile.mobile.changePage(this.node, {transition: "none"});
	}
}, {
	meta: {
		"name": "Page",
		"type": "Page",
		"cateogory": "UI",
		"icon": "images/jqm_page_icon.png",
		"properties": [
		]
	}

});

ComponentFramework.JQueryMobile.Header = ComponentFramework.JQueryMobile.UIComponent.extend({
	
	generateUICode: function(parentNode, $mobile) {
		var defaultValue = this.getProperty("Title").defaultValue;
		this.node = $mobile("<header data-role=\"header\" data-position=\"fixed\"><h1>" + defaultValue + "</h1></header>");
		parentNode.append(this.node);
		this.refresh($mobile);
	}		
}, {
	meta: {
		"name": "Header",
		"type": "Header",
		"cateogory": "UI",
		"icon": "images/jqm_header_icon.png",
		"properties": [
			{
				"name": "Title",
				"type": "String",
				"description": "Header Title",
				"defaultValue": "Header"
					
			}
		]
	}
});

ComponentFramework.JQueryMobile.Footer = ComponentFramework.JQueryMobile.UIComponent.extend({
	
	generateUICode: function(parentNode, $mobile) {
		var defaultValue = this.getProperty("Title").defaultValue;
		this.node = $mobile("<footer data-role=\"footer\" data-position=\"fixed\"><h4>" + defaultValue + "</h4></footer>");
		parentNode.append(this.node);
		this.refresh($mobile);
	}
}, {
	meta: {
		"name": "Footer",
		"type": "Footer",
		"cateogory": "UI",
		"icon": "images/jqm_footer_icon.png",
		"properties": [
			{
				"name": "Title",
				"type": "String",
				"description": "Footer Title",
				"defaultValue": "Footer"
			}
		]
	}
});

ComponentFramework.JQueryMobile.Button = ComponentFramework.JQueryMobile.UIComponent.extend({
	
	generateUICode: function(parentNode, $mobile) {
		var defaultValue = this.getProperty("Text").defaultValue;
		this.node = $mobile("<button data-role=\"button\">" + defaultValue + "</button>");
		parentNode.append(this.node);
		this.refresh($mobile);
	}

}, {
	meta: {
		"name": "Button",
		"type": "Button",
		"cateogory": "UI",
		"icon": "images/jqm_button_icon.png",
		"properties": [
			{
				"name": "Text",
				"type": "String",
				"description": "Button title",
				"defaultValue": "Button"
					
			},
			{
				"name": "Icon",
				"type": "String",
				"description": "Button icon",
				"mapping": {
					"arrow-l": "Left Arrow"
				}
			},
			{
				"name": "IconPosition",
				"type": "String",
				"description": "Icon position",
				"mapping": {
					"top": "Top",
					"bottom": "Bottom",
					"left": "Left",
					"right": "Right"
				},
				"defaultValue": "left"
			},
			{
				"name": "Corners",
				"type": "Boolean",
				"description": "Button corner",
				"defaultValue": true
			},
			{
				"name": "IconShadow",
				"type": "Boolean",
				"description": "Icon shadow",
				"defaultValue": true
			},
			{
				"name": "Shadow",
				"type": "Boolean",
				"description": "Button shadow",
				"defaultValue": true
			},
			{
				"name": "Inline",
				"type": "Boolean",
				"description": "Auto-size",
				"defaultValue": false
			},
			{
				"name": "Mini",
				"type": "Boolean",
				"description": "Mini button",
				"defaultValue": false
			}
		]
	}
});

ComponentFramework.JQueryMobile.TextArea = ComponentFramework.JQueryMobile.UIComponent.extend({
	
	generateUICode: function(parentNode, $mobile) {
		this.node = $mobile("<textarea data-role=\"textarea\"></textarea>");
		parentNode.append(this.node);
		this.refresh($mobile);
	}
}, {
	meta: {
		"name": "TextArea",
		"type": "TextArea",
		"cateogory": "UI",
		"icon": "images/jqm_text_area_icon.png",
		"properties": [
		]
	}
});