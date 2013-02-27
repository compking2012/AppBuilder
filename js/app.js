require.config({
	paths: {
	    jquery: "libs/jquery/jquery-1.8.0.min",
	    jqueryui: "libs/jqueryui/jquery-ui-1.8.23.custom",
	    jqueryuilayout: "libs/jqueryplugins/uilayout/jquery.layout-latest.min",
	    jquerymenu: "libs/jqueryplugins/uimenu/js/superfish",
	    jquerytree: "libs/jqueryplugins/uitree/jquery.jstree",
	    jquerycookie: "libs/jqueryplugins/cookie/jquery.cookie",
	    jquerycolorpicker: "libs/jqueryplugins/uicolorpicker/colorpicker",
	    underscore: "libs/backbone/underscore-1.3.3",
	    backbone: "libs/backbone/backbone-0.9.2",
	    bootstrap: "libs/bootstrap/js/bootstrap.min",
	    mvc: "libs/mvc",
	    ajile: "libs/ajile/com.iskitz.ajile.1.2.1",
	    codemirror: "libs/codemirror/lib/codemirror",
	    codemirrorui: "libs/codemirror/ui/js/codemirror-ui",
	    codemirrorjsmode: "libs/codemirror/mode/javascript/javascript",
	    text: "libs/require/plugins/text"
	},
	
	shim: {
		"jquery": {
			exports: "$"
		},
		
		"jqueryui": {
			deps: ["jquery"],
			exports: "$ui"
		},
		"jqueryuilayout": {
			deps: ["jqueryui"],
			exports: "$uilayout"
		},
		
		"jquerymenu": {
			deps: ["jqueryui"],
			exports: "$uimenu"
		},

		"jquerytree": {
			deps: ["jqueryui"],
			exports: "$uitree"
		},

		"jquerycookie": {
			deps: ["jquery"],
			exports: "$cookie"
		},
		
		"jquerycolorpicker": {
			deps: ["jqueryui"],
			exports: "$uicolorpicker"
		},
		
		"underscore": {
			deps: ["jquery"],
			exports: "_"
		},
		
		"backbone": {
			deps: ["underscore", "jquery"],
			exports: "Backbone"
		},
		
		"mvc": {
			deps: ["backbone"],
			exports: "mvc"
		},
		
		"bootstrap": {
			deps: ["jquery"],
			exports: "bootstrap"
		},
		
		"ajile": {
			deps: ["jquery", "backbone"],
			exports: "ajile"
		},
		
		"codemirror": {
			exports: "codemirror"
		},
		
		"codemirrorui": {
			deps: ["codemirror"],
			exports: "codemirrorui"
		},
		
		"codemirrorjsmode": {
			deps: ["codemirror"],
			exports: "codemirrorjsmode"
		}
	}
});

var configuration = {
	passportServer: "https://passport.rdtest.baidu.com",
	staticPath: "/static/appbuilder",
	//apiPath: "/static/restapi"
	apiPath: "/appbuilder"
};

var mainController = null;
require(["controllers/MainController"], function(MainController){
	mainController = new MainController($("body"), null);
});
