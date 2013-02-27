define([
	"jquery", "underscore", "backbone", "mvc", 
	"views/RunProjectView", "views/DeployProjectView", "views/TestProjectView",  "views/ConfirmView",
	"models/ExecutionModel",
	"text!components/templates/index.html", "text!components/templates/viewtemplate.html", "text!components/templates/app.js",
	"text!components/templates/view.js", "text!components/templates/viewdomnodeattachpoint.js", "text!components/templates/viewevent.js", "text!components/templates/vieweventhandler.js",
	"text!components/templates/controller.js", "text!components/templates/controllerviewrender.js", 
	"text!components/templates/controllereventlistener.js", "text!components/templates/controllereventhandler.js"
	
], function($, _, Backbone, MVC, RunProjectView, DeployProjectView, TestProjectView, ConfirmView, 
		ExecutionModel,
		TemplateHTMLIndex, TemplateHTMLViewTemplate, TemplateJSApp, 
		TemplateJSViewCode, TemplateJSViewDOMNodeAttachPointCode, TemplateJSViewEventCode, TemplateJSViewEventHandlerCoode,
		TemplateJSControllerCode, TemplateJSControllerViewRenderCode, TemplateJSControllerEventListenerCode, 
		TemplateJSControllerEventHandlerCode) {
	var RunController = AppBuilder.Controller.extend({
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showView: function() {
		},
		
		startApp: function(project) {
			var dialog = new RunProjectView();
			dialog.on("onOK", $.proxy(function(name) {
				dialog.powerOff();
			}, this));
			this.node.append(dialog.$el);
			dialog.render();
			var runProject = new ExecutionModel(project, ExecutionModel.Mode.RUN);
			runProject.save({languageType: "php", htmlCode: this.generateHTMLIndex(), jsCode: this.generateJSApp(), cssCode: this.generateCSSApp() }, {
				success: $.proxy(function(run) {
					this.onSuccessRunProject(dialog, run);
				}, this),
				error: $.proxy(this.onErrorRunProject, this)
			});
		},
		
		onSuccessRunProject: function(dialog, runProject) {
			dialog.openApp(runProject.get("URL"));
		},
		
		onErrorRunProject: function() {
			var dialog = new ConfirmView("Project run error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		deployApp: function(project) {
			var dialog = new DeployProjectView();
			dialog.on("onOK", $.proxy(function(name) {
				var deployProject = new ExecutionModel(project, ExecutionModel.Mode.DEPLOY);
				deployProject.save({languageType: "php", domain: name, htmlCode: this.generateHTMLIndex(), jsCode: this.generateJSApp(), cssCode: this.generateCSSApp() }, {
					success: $.proxy(this.onSuccessDeployProject, this),
					error: $.proxy(this.onErrorDeployProject, this)
				});
			}, this));
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onSuccessDeployProject: function(deployProject) {
			var dialog = new ConfirmView("Project deployed successfully.", ConfirmView.style.MESSAGE);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onErrorDeployProject: function() {
			var dialog = new ConfirmView("Project deployed error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		testApp: function(project) {
			var dialog = new TestProjectView();
			dialog.on("onOK", $.proxy(function(name) {
				dialog.powerOff();
			}, this));
			this.node.append(dialog.$el);
			dialog.render();
			var testProject = new ExecutionModel(project, ExecutionModel.Mode.TEST);
			testProject.save({}, {
				success: $.proxy(function(test) {
					this.onSuccessTestProject(dialog, test);
				}, this),
				error: $.proxy(this.onErrorTestProject, this)
			});
		},
		
		onSuccessTestProject: function(dialog, testProject) {
			dialog.openApp(testProject.get("URL"));
		},
		
		onErrorTestProject: function() {
			var dialog = new ConfirmView("Project tested error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		loadComponents: function(json) {
			if(json.length == 0) {
				return "";
			}
			var rootJson = json[0];
			return this.loadComponent(rootJson, null);
		},
		
		loadComponent: function(json, container) {
			var component = this.parentController.componentLibraryController.getComponentFromClassInfo(json.classInfo);
			component.deserialize(json);
			if(container) {
				container.addChild(component, -1);
			}
			
			$.each(json.children, $.proxy(function(index, childJson) {
				this.loadComponent(childJson, component);
			}, this));
			return component;
		},
		
		generateHTMLIndex: function() {
			var info = this.parentController.projectController.getProjectInfo();
			var code = TemplateHTMLIndex.replace(/\${AppFullName}/g, info.appFullName)
						.replace(/\${AppDescription}/g, info.appDescription)
						.replace(/\${AppAuthor}/g, info.appAuthor)
						.replace(/\${AppTouchIcon}/g, info.appTouchIcon)
						.replace(/\${AppStartupImage}/g, info.appStartupImage)
						.replace(/\${AppViewTemplates}/g, this.generateHTMLTemplatesCode(info));
			return code;
		},
		
		generateHTMLTemplatesCode: function(info) {
			var code = "";
			info.pages.each($.proxy(function(page) {
				var template = $("<div></div>").append(this.loadComponents(page.get("components")).node).html();
				code += TemplateHTMLViewTemplate.replace(/\${AppPageName}/g, page.get("name"))
						.replace(/\${AppViewTemplate}/g, template);
			}, this));
			return code;
		},
		
		generateJSApp: function() {
			var info = this.parentController.projectController.getProjectInfo();
			var code = TemplateJSApp.replace(/\${AppName}/g, info.appName)
						.replace(/\${AppDefaultPageName}/g, info.appDefaultPageName)
						.replace(/\${AppViews}/g, this.generateJSViewsCode(info))
						.replace(/\${AppControllers}/g, this.generateJSControllersCode(info));
			return code;
		},
		
		generateJSViewsCode: function(info) {
			var code = "";
			info.pages.each($.proxy(function(page) {
				code += TemplateJSViewCode.replace(/\${AppName}/g, info.appName)
						.replace(/\${AppPageName}/g, page.get("name"))
						.replace(/\${AppViewEvents}/g, this.generateJSViewEventsCode(page))
						.replace(/\${AppViewMembers}/g, this.generateJSViewMembersCode(page))
						.replace(/\${AppViewDOMNodeAttachPoints}/g, this.generateJSViewDOMNodeAttachPointsCode(page))
						.replace(/\${AppViewEventHandlers}/g, this.generateJSViewEventHandlersCode(page))
						.replace(/\${AppViewMethods}/g, this.generateJSViewMethods(page));
			}, this));
			return code;
		},
		
		generateJSViewDOMNodeAttachPointsCode: function(page) {
			var components = this.parentController.componentLibraryController.getAllComponents(this.loadComponents(page.get("components")));
			var code = "";
			$.each(components, $.proxy(function(index, component) {
				code += TemplateJSViewDOMNodeAttachPointCode.replace(/\${AppViewComponentID}/g, component.getProperty("ID").value) + "\n";
			}, this));
			return code;
		},
		
		generateJSViewEventsCode: function(page) {
			var components = this.parentController.componentLibraryController.getAllComponents(this.loadComponents(page.get("components")));
			var code = "";
			$.each(components, $.proxy(function(index, component) {
				$.each(component.getEvents(), $.proxy(function(k, event) {
					if(event.handler) {
						code += TemplateJSViewEventCode.replace(/\${AppViewEventType}/g, event.domEvent)
								.replace(/\${AppViewEventName}/g, event.name)
								.replace(/\${AppViewComponentID}/g, component.getProperty("ID").value) + ", \n";
					}
				}, this));
			}, this));
			return code;
		},
		
		generateJSViewMembersCode: function(page) {
			return "";
		},
		
		generateJSViewEventHandlersCode: function(page) {
			var components = this.parentController.componentLibraryController.getAllComponents(this.loadComponents(page.get("components")));
			var code = "";
			$.each(components, $.proxy(function(index, component) {
				$.each(component.getEvents(), $.proxy(function(k, event) {
					if(event.handler) {
						code += TemplateJSViewEventHandlerCoode.replace(/\${AppViewEventType}/g, event.domEvent)
								.replace(/\${AppViewEventName}/g, event.name)
								.replace(/\${AppViewComponentID}/g, component.getProperty("ID").value)
								.replace(/\${AppViewEventHandler}/g, event.handler) + ", \n";
					}
				}, this));
			}, this));
			return code;
		},
		
		generateJSViewMethods: function(page) {
			return "";
		},
		
		generateJSControllersCode: function(info) {
			var code = "";
			info.pages.each($.proxy(function(page) {
				code += TemplateJSControllerCode.replace(/\${AppName}/g, info.appName)
						.replace(/\${AppPageName}/g, page.get("name"))
						.replace(/\${AppDefaultPageName}/g, info.appDefaultPageName)
						.replace(/\${AppControllerMembers}/g, this.generateJSControllerMembersCode(page))
						.replace(/\${AppControllerViewRenders}/g, this.generateJSControllerViewRendersCode(info.appName, page))
						.replace(/\${AppControllerEventHandlers}/g, this.generateJSControllerEventHandlersCode(page));
			}, this));
			return code;
		},
		
		generateJSControllerMembersCode: function(page) {
			return "";
		},
		
		generateJSControllerViewRendersCode: function(appName, page) {
			//TODO: pages should be got from the page connections of controller
			var pages = [page];
			var code = "";
			$.each(pages, $.proxy(function(index, page) {
				code += TemplateJSControllerViewRenderCode.replace(/\${AppName}/g, appName)
						.replace(/\${AppPageName}/g, page.get("name"))
						.replace(/\${AppControllerEventListeners}/g, this.generateJSControllerEventListenersCode());
			}, this));
			return code;
		},
		
		generateJSControllerEventListenersCode: function(page) {
			return "";
		},
		
		generateJSControllerEventHandlersCode: function(page) {
			return "";
		},
		
		generateCSSApp: function() {
			return "";
		}
	});
	return RunController;
});