Namespace("ComponentFramework.HTMLNative");

Import("ComponentFramework.Base.UIComponent", "js/components/base");

//ChocolateChip UI Components
ComponentFramework.HTMLNative.UIComponent = ComponentFramework.Base.UIComponent.extend({
	initialize: function() {
		ComponentFramework.UIComponent.prototype.initialize.call(this);
	}
});
