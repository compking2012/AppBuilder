require.config({
	paths: {
	    jquery: "libs/jquery/jquery-1.8.0.min",
	    jqueryui: "libs/jqueryui/jquery-ui-1.8.23.custom",
	    chui: "libs/chui/chui/chui",
	    underscore: "libs/backbone/underscore-1.3.3",
	    backbone: "libs/backbone/backbone-0.9.2",
	    mvc: "libs/mvc",
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
		
		"chui": {
			deps: ["jquery"],
			expoerts: "$chui"
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
		}
	}
});

require(["controllers/MobileController"], function(MobileController){
	window.setTimeout(check=function() {
		if(window.parent.mainController) {
			var mobileController = new MobileController($("body"), window.parent.mainController);
			window.parent.mainController.setMobileController(mobileController);
		}
		else {
			window.setTimeout(check, 10);
		}
	}, 10);
});
