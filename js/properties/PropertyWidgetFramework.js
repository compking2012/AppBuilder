define([
	"jquery", "jqueryui", "underscore", "backbone", "jquerycolorpicker"
], function($, $ui, _, Backbone, $uicolorpicker) {
	var PropertyWidgetFramework = {};
	
	//Base Class
	PropertyWidgetFramework.BaseWidget = Backbone.View.extend({
		template: null,
		
		property: null,

		initialize: function(property) {
			var html = _.template(this.template)();
			this.$el = $("<div></div>");
			this.$el.append(html);
			this.property = property;
		},
		
		destroy: function() {
			this.remove();
		},
		
		setValue: function(value) {
			this.property.value = value;
		},
		
		onChange: function() {
			
		}
	});
	_.extend(PropertyWidgetFramework.BaseWidget, Backbone.Events);
	
	PropertyWidgetFramework.TextWidget = PropertyWidgetFramework.BaseWidget.extend({
		template: "<label></label><input type=\"text\" />",

		label: null,
		value: null,
		
		render: function() {
			this.label = $("label", this.$el);
			this.value = $("input", this.$el);
			this.label.html(this.property.name);
			this.label.attr("for", "property_" + this.property.name);
			this.value.attr("name", "property_" + this.property.name);
			this.value.on("keyup", $.proxy(this.onChange, this));

			this.setValue(this.property.value);
		},
		
		destroy: function() {
			this.label = null;
			if(this.value) {
				this.value.off();
				this.value = null;
			}
			PropertyWidgetFramework.BaseWidget.prototype.destroy.call(this);
		},
		
		setValue: function(value) {
			this.value.val(value);
			this.property.value = value;
			this.onChange();
		},
		
		onChange: function() {
			this.trigger("onPropertyChange", this.property.name, this.value.val());
		}
	});
	
	PropertyWidgetFramework.SelectTextWidget = PropertyWidgetFramework.TextWidget.extend({
		template: "<span></span><select></select>",

		label: null,
		list: null,
		
		render: function() {
			this.label = $("span", this.$el);
			this.list = $("select", this.$el);
			this.label.html(this.property.name);
			for(var key in this.property.mapping) {
				var value = this.property.mapping[key];
				var item = $("<option></option>");
				item.attr("value", key);
				item.html(value);
				this.list.append(item);
			}
			this.list.on("change", $.proxy(this.onChange, this));

			this.setValue(this.property.value);
		},
		
		destroy: function() {
			this.label = null;
			if(this.list) {
				this.list.off();
				this.list = null;
			}
			PropertyWidgetFramework.TextWidget.prototype.destroy.call(this);
		},
		
		setValue: function(value) {
			this.list.val(value);
			this.property.value = value;
			this.onChange();
		},
		
		onChange: function() {
			this.trigger("onPropertyChange", this.property.name, this.list.val());
		}
	});
	
	PropertyWidgetFramework.EditableSelectTextWidget = PropertyWidgetFramework.SelectTextWidget.extend({
		template: null,

		label: null,
		value: null,
		list: null,
		
		initialize: function(property) {
			this.template = "<span></span><input list=\"datalist_" + property.name + "\" /><datalist id=\"datalist_" + property.name + "\"></datalist>";
			PropertyWidgetFramework.SelectTextWidget.prototype.initialize.call(this, property);
		},
		
		render: function() {
			this.label = $("span", this.$el);
			this.value = $("input", this.$el);
			this.list = $("datalist", this.$el);
			this.label.html(this.property.name);
			for(var key in this.property.mapping) {
				var value = this.property.mapping[key];
				var item = $("<option></option>");
				item.attr("value", key);
				item.html(value);
				this.list.append(item);
			}
			this.value.on("keyup", $.proxy(this.onChange, this));

			this.setValue(this.property.value);
		},
		
		destroy: function() {
			this.label = null;
			if(this.value) {
				this.value.off();
				this.value = null;
			}
			if(this.list) {
				this.list.empty();
				this.list = null;
			}
			PropertyWidgetFramework.SelectTextWidget.prototype.destroy.call(this);
		},
		
		setValue: function(value) {
			this.value.val(value);
			this.property.value = value;
			this.onChange();
		},
		
		onChange: function() {
			this.trigger("onPropertyChange", this.property.name, this.value.val());
		}
	});
	
	PropertyWidgetFramework.ImageWidget = PropertyWidgetFramework.BaseWidget.extend({

		render: function() {
		},
		
		destroy: function() {
			PropertyWidgetFramework.BaseWidget.prototype.destroy.call(this);
		}
	});

	PropertyWidgetFramework.SelectImageWidget = PropertyWidgetFramework.ImageWidget.extend({

		render: function() {
		},
		
		destroy: function() {
			PropertyWidgetFramework.ImageWidget.prototype.destroy.call(this);
		}
	});
	
	PropertyWidgetFramework.ListWidget = PropertyWidgetFramework.BaseWidget.extend({
		template: "<textarea></textarea>",
		
		list: null,
		
		render: function() {
			this.list = $("textarea", this.$el);
			//$.each(this.property.list)
		},
		
		destroy: function() {
			PropertyWidgetFramework.BaseWidget.prototype.destroy.call(this);
		},

		onChange: function() {
			this.trigger("onPropertyChange", this.property.name, this.value);
		}
	});
	
	PropertyWidgetFramework.SizeWidget = PropertyWidgetFramework.BaseWidget.extend({
		template: "<label></label><input type=\"number\" style=\"width:50px;\" min=\"0\"/><select style=\"width:50px;\"><option value=\"inherited\">Inherited</option><option value=\"auto\">Auto</option><option value=\"%\">%</option><option value=\"px\">px</option><option value=\"em\">em</option></select>",
		
		label: null,
		value: null,
		unit: null,
		
		render: function() {
			this.label = $("label", this.$el);
			this.value = $("input", this.$el);
			this.label.html(this.property.name);
			this.label.attr("for", "property_" + this.property.name);
			this.value.attr("name", "property_" + this.property.name);
			this.unit = $("select", this.$el);
			this.value.on("input", $.proxy(this.onChange, this));
			this.unit.on("change", $.proxy(this.onSwitchUnit, this));

			this.setValue(this.property.value);
		},
		
		destroy: function() {
			this.label = null;
			if(this.value) {
				this.value.off();
				this.value = null;
			}
			if(this.unit) {
				this.unit.off();
				this.unit = null;
			}
			PropertyWidgetFramework.BaseWidget.prototype.destroy.call(this);
		},
		
		onSwitchUnit: function() {
			if(this.unit.val() == "auto" || this.unit.val() == "inherited") {
				this.value.addClass("hide");
			}
			else {
				this.value.removeClass("hide");
			}
		},
		
		setValue: function(value) {
			if(value == "inherited") {
				this.value.val(0);
				this.unit.val("inherited");
			}
			else if(value == "auto") {
				this.value.val(0);
				this.unit.val("auto");
			}
			else if(value.lastIndexOf("px") >= 0) {
				this.value.val(parseInt(value));
				this.unit.val("px");
			}
			else if(value.lastIndexOf("em") >= 0) {
				this.value.val(parseInt(value));
				this.unit.val("em");
			}
			else if(value.lastIndexOf("%") >=0) {
				this.value.val(parseInt(value));
				this.unit.val("%");
			}
			this.onSwitchUnit();

			this.property.value = value;
			this.onChange();
		},
		
		onChange: function() {
			this.trigger("onPropertyChange", this.property.name, ((this.unit.val() == "auto" || this.unit.val() == "inherited") ? this.unit.val() : this.value.val() + this.unit.val()));
		}
	});
	
	PropertyWidgetFramework.MultiSelectTextWidget = PropertyWidgetFramework.SelectTextWidget.extend({
		template: "<span></span><select multiple=\"true\"></select>",

		label: null,
		list: null,

		render: function() {
			this.label = $("span", this.$el);
			this.list = $("select", this.$el);
			this.label.html(this.property.name);
			for(var key in this.property.mapping) {
				var value = this.property.mapping[key];
				var item = $("<option></option>");
				item.attr("value", key);
				item.html(value);
				this.list.append(item);
			}
			this.list.on("change", $.proxy(this.onChange, this));

			this.setValue(this.property.value);
		},
		
		destroy: function() {
			this.label = null;
			if(this.list) {
				this.list.empty();
				this.list.off();
				this.list = null;
			}
			PropertyWidgetFramework.SelectTextWidget.prototype.destroy.call(this);
		},
		
		setValue: function(value) {
			/*var values = value.split(" ");
			$.each(this.list, $.proxy(function(index, item) {
				for(var i=0; i<values.length; i++) {
					if(item.html() == values[i]) {
						item.attr("selected", "selected");
						break;
					}
				}
			}, this));*/
			//TODO: allow to change the value correctly
			this.property.value = value;
			this.onChange();
		},
		
		onChange: function() {
			this.trigger("onPropertyChange", this.property.name, this.list.val().join(" "));
		}
	});	
	
	PropertyWidgetFramework.ColorPickerWidget = PropertyWidgetFramework.BaseWidget.extend({
		template: "<label></label><div class=\"colorselector\"><div style=\"background-color: #0000ff\"></div></div>",
		
		render: function() {
			this.label = $("label", this.$el);
			this.value = $("div.colorselector", this.$el);
			this.value.ColorPicker({
				onChange: $.proxy(function(hsb, hex, rgb) {
					this.value.find("div").css("backgroundColor", "#" + hex);
					this.onChange();
				}, this)
			});
			this.label.html(this.property.name);
			this.label.attr("for", "property_" + this.property.name);
			this.value.attr("name", "property_" + this.property.name);
			this.setValue(this.property.value);
		},
		
		destroy: function() {
			this.label = null;
			if(this.value) {
				this.value.off();
				this.value = null;
			}
			PropertyWidgetFramework.BaseWidget.prototype.destroy.call(this);
		},
		
		setValue: function(value) {
			this.value.val(value);
			this.onChange();
		},
		
		onChange: function() {
			this.trigger("onPropertyChange", this.property.name, this.value.find("div").css("backgroundColor"));
		}
	});	
	
	return PropertyWidgetFramework;
});
