define([
    "jquery", "backbone", "mvc",
    "models/ComponentModel"
], function($, Backbone, MVC, ComponentModel) {
	var ComponentCollection = AppBuilder.Collection.extend({
		model: ComponentModel,
		
		initialize: function() {
			AppBuilder.Collection.prototype.initialize.call(this);
		},
		
		url: function() {
			return configuration.staticPath + "/js/components/components.json";
		},
		
		parse: function(response) {
			var data = response.data;
			var result = [
			    {
			    	type: "uiComponents",
			    	components: data
			    },
			    {
			    	type: "serviceComponents",
			    	components: []
			    },
			    {
			    	type: "customComponents",
			    	components: []
			    }
			];
			return result;
		}
	});
	return ComponentCollection;
});