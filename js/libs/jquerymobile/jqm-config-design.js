$(document).bind("mobileinit", function () {
	$.mobile.defaultPageTransition = "none";
	$.mobile.selectmenu.prototype.options.nativeMenu = false;
	$.mobile.autoInitializePage = false;
});