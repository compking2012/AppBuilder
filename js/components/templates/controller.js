${AppName}.${AppPageName}Controller = AppBuilder.WebAppFramework.Controller.extend({

	routes:{
        "": "show${AppDefaultPageName}"
    },
    
    ${AppControllerMembers}

    ${AppControllerViewRenders}
    
    ${AppControllerEventHandlers}
});