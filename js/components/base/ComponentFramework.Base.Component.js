Namespace("ComponentFramework.Base");

//Base Class
ComponentFramework.Base.Component = Backbone.View.extend({

	initialize: function() {
		this.id = -1;
		this.properties = $.extend(true, [], this.constructor.meta.properties);
		this.initProperties();
		this.eventset = $.extend(true, [], this.constructor.meta.events);
		this.initEvents();
		this.on("onPropertyChange", $.proxy(this.onPropertyChange, this));
		this.on("onEventChange", $.proxy(this.onEventChange, this));
	},
	
	getId: function() {
		return this.id;
	},
	
	initProperties: function() {
		for(var i=0; i<this.properties.length; i++) {
			this.properties[i].value = this.properties[i].defaultValue;
		}
	},
	
	initEvents: function() {
		for(var i=0; i<this.eventset.length; i++) {
			this.eventset[i].handler = null;
		}
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
	
	getDefaultSize: function() {
		return this.constructor.meta.defaultSize;
	},
	
	isAcceptable: function(parent) {
		return true;
	},
	
	onPropertyChange: function(name, value) {
		this.setPropertyValue(name, value);
	},
	
	onEventChange: function(name, handler) {
		this.setEventHandler(name, handler);
	},
	
	generateUICode: function($mobile) {
		return null;
	}
}, {
	meta: null
});