//Switch page handler
show${AppPageName}: function() {
	if(this.${AppPageName}View) {
		this.${AppPageName}View.remove();
		this.${AppPageName}View = null;
	}
	this.${AppPageName}View = new ${AppName}.${AppPageName}View();
	${AppControllerEventListeners}
	$.app.append(this.${AppPageName}View.$el);
}