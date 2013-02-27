define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", "properties/PropertyWidgetFramework", 
    "text!views/PropertyView.html"
], function($, $ui, _, Backbone, MVC, PropertyWidgetFramework, template) {
	var PropertyView = AppBuilder.View.extend({
		template: template,
		
		list: null,
		propertyWidgets: {},
		
		events: {
			
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);
			this.list = this.getElement("#list");
		},
		
		render: function() {
			
		},
		
		clearProperties: function() {
			this.list.empty();
			for(var name in this.propertyWidgets) {
				this.propertyWidgets[name].destroy();
			}
		},
		
		setPropertyValue: function(name, value) {
			this.propertyWidgets[name].setValue(value);
		},
		
		addProperty: function(property) {
			var widget = null;
			
			if(property.type == "String") {
				if(property.mapping) {
					if(property.exclusive) {
						widget = new PropertyWidgetFramework.SelectTextWidget(property);
					}
					else if(property.multiSelect) {
						widget = new PropertyWidgetFramework.SelectTextWidget(property);
					}
					else {
						widget = new PropertyWidgetFramework.EditableSelectTextWidget(property);
					}
				}
				else {
					widget = new PropertyWidgetFramework.TextWidget(property);
				}
			}
			else if(property.type == "Image") {
				if(property.mapping) {
					widget = new PropertyWidgetFramework.SelectImageWidget(property);
				}
				else {
					widget = new PropertyWidgetFramework.ImageWidget(property);
				}
			}
			else if(property.type == "List") {
				if(property.list) {
					widget = new PropertyWidgetFramework.ListWidget(property);
				}
			}
			else if(property.type == "Size") {
				widget = new PropertyWidgetFramework.SizeWidget(property);
			}
			else if(property.type == "Color") {
				widget = new PropertyWidgetFramework.ColorPickerWidget(property);
			}
			widget.on("onPropertyChange", $.proxy(this.onPropertyChange, this));
			widget.render();
			var item = $("<li></li>").append(widget.$el);
			this.propertyWidgets[property.name] = widget;
			this.list.append(item);
		},
		
		onPropertyChange: function(name, value) {
			this.trigger("onPropertyChange", name, value);
		}
	});
	return PropertyView;
});