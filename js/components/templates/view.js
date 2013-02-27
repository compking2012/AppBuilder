${AppName}.${AppPageName}View = AppBuilder.WebAppFramework.View.extend({
	template: "#template-${AppPageName}",
	
	events: {
		${AppViewEvents}
	},
	
	${AppViewMembers}
	
	initialize: function() {
		//TODO: add construction code here
		AppBuilder.WebAppFramework.View.prototype.initialize.call(this);
	},
	
	render: function() {
		AppBuilder.WebAppFramework.View.prototype.render.call(this);
		//TODO: add UI rendering code here

		//TODO: add DOM node attach point code here
		${AppViewDOMNodeAttachPoints}
	},
	
	${AppViewEventHandlers}
	
	${AppViewMethods}
});