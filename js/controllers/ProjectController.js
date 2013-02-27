define([
	"jquery", "underscore", "backbone", "mvc", 
	"models/ProjectModel", "models/ProjectCollection", "models/PageModel", 
	"models/PageCollection",
	"views/ProjectView", "views/NewProjectView", "views/OpenProjectView", 
	"views/RemoveProjectView", "views/NewPageView", "views/ConfirmView",
	"views/SetupProjectView"
], function($, _, Backbone, MVC,  ProjectModel, ProjectCollection, PageModel, PageCollection,
		ProjectView, NewProjectView, OpenProjectView, RemoveProjectView, NewPageView, ConfirmView,
		SetupProjectView) {
	var ProjectController = AppBuilder.Controller.extend({
		
		project: null,
		pages: null,
		components: [],
		services: null,
		currentPage: null,
		
		unsaved: false,
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showView: function() {
			this.on("onNewProject", $.proxy(this.onNewProject, this));
			this.on("onOpenProject", $.proxy(this.onOpenProject, this));
			this.on("onSaveProject", $.proxy(this.onSaveProject, this));
			this.on("onCloseProject", $.proxy(this.onCloseProject, this));
			this.on("onRemoveProject", $.proxy(this.onRemoveProject, this));
			this.on("onSetupProject", $.proxy(this.onSetupProject, this));
			this.on("onNewPage", $.proxy(this.onNewPage, this));
			
			this.on("onUndo",$.proxy(this.onUndo,this));
			this.on("onRedo",$.proxy(this.onRedo,this));
			this.on("onRemovePage", $.proxy(this.onRemovePage, this));
			this.on("onCopyComponent", $.proxy(this.onCopyComponent, this));
			this.on("onCutComponent", $.proxy(this.onCutComponent, this));
			this.on("onPasteComponent", $.proxy(this.onPasteComponent, this));
			this.on("onRemoveComponent", $.proxy(this.onRemoveComponent, this));
			
			this.on("onRunProject", $.proxy(this.onRunProject, this));
			this.on("onDeployProject", $.proxy(this.onDeployProject, this));
			this.on("onTestProject", $.proxy(this.onTestProject, this));
			
			this.view = new ProjectView();
			this.view.on("onSelectPage", $.proxy(this.onSelectPage, this));
			this.node.append(this.view.$el);
			this.view.render();
		},
		
		onNewProject: function() {
			var dialog = new NewProjectView();
			dialog.on("onOK", $.proxy(function(name) {
				if(this.project) {
					this.onCloseProject(function() {
						this.newProject(name);
					});
				}
				else {
					this.newProject(name);
				}
			}, this));
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		newProject: function(name) {
			var projects = new ProjectCollection();
			projects.create(new ProjectModel({"name": name}), {
				success: $.proxy(function(project) {
					project.fetch({
						success: $.proxy(this.onSuccessNewProject, this),
						error: $.proxy(this.onErrorNewProject, this)
					});
				}, this),
				error: $.proxy(this.onErrorNewProject, this)
			});
		},
		
		onSuccessNewProject: function(project) {
			this.loadProject(project);
		},
		
		onErrorNewProject: function() {
			var dialog = new ConfirmView("Project created error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onOpenProject: function() {
			var projects = new ProjectCollection();
			projects.fetch({
				success: $.proxy(function(projects) {
					var dialog = new OpenProjectView(projects);
					dialog.on("onOK", $.proxy(function(project) {
						if(this.project) {
							this.onCloseProject(function() {
								this.openProject(project);
							});
						}
						else {
							this.openProject(project);
						}
					}, this));
					this.node.append(dialog.$el);
					dialog.render();
				}, this),
				error: $.proxy(this.onErrorOpenProject, this)
			});
		},
		
		openProject: function(project) {
			project.fetch({
				success: $.proxy(this.onSuccessOpenProject, this),
				error: $.proxy(this.onErrorOpenProject, this)
			});
		},
		
		onSuccessOpenProject: function(project) {
			this.loadProject(project);
		},
		
		onErrorOpenProject: function() {
			var dialog = new ConfirmView("Project opened error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		loadProject: function(project) {
			this.project = project;
			//this.unsaved = true;
			this.openPages();
			this.openServices();
			this.view.showProject(project);
		},
		
		openPages: function() {
			var pages = new PageCollection(this.project);
			pages.fetch({
				success: $.proxy(this.onSuccessOpenPages, this),
				error: $.proxy(this.onErrorOpenPages, this)
			});
		},
		
		onSuccessOpenPages: function(pages) {
			this.pages = pages;
			this.view.showPages(pages);
		},
		
		onErrorOpenPages: function() {
			var dialog = new ConfirmView("Pages opened error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		openServices: function() {
			//TODO: open services
		},
		
		onSaveProject: function() {
			//TODO: if need to save projects when changed or on timer?
			this.parentController.mobileController.saveComponents();
			this.project.save({}, {
				success: $.proxy(function() {
					this.pages.each($.proxy(function(page) {
						page.save({}, {
							//success: $.proxy(this.onSuccessSaveProject, this),
							error: $.proxy(this.onErrorSaveProject, this)
						});	
					}, this));
					//FIXME: should be save it one by one and check if all successfully
					this.onSuccessSaveProject();	
				}, this), 
				error: $.proxy(this.onErrorSaveProject, this)
			});
		},
		
		onSuccessSaveProject: function() {
			var dialog = new ConfirmView("Project saved successfully.", ConfirmView.style.MESSAGE);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onErrorSaveProject: function() {
			var dialog = new ConfirmView("Project saved error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onCloseProject: function(callback) {
			if(this.project && this.unsaved) {
				var dialog = new ConfirmView("A opened project is unsaved, save it?", ConfirmView.style.CONFIRM);
				dialog.on("onOK", $.proxy(function() {
					this.onSaveProject();
					this.unloadProject();
					if(callback) {
						callback.call(this);
					}
				}, this));
				dialog.on("onCancel", $.proxy(function() {
					this.unloadProject();
					if(callback) {
						callback.call(this);
					}
				}, this));
				this.node.append(dialog.$el);
				dialog.render();
			}
			else {
				this.unloadProject();
				if(callback) {
					callback.call(this);
				}
			}
		},
		
		unloadProject: function() {
			this.project = null;
			this.pages = null;
			this.services = null;
			//this.unsaved = false;
			this.view.showProject(null);
			this.parentController.canvasController.unselectComponent();
			this.parentController.mobileController.clearComponents();
			this.parentController.propertyController.clearProperties();
			this.parentController.eventController.clearEvents();
		},
		
		onRemoveProject: function() {
			if(this.project) {
				this.onCloseProject(this.removeProject);
			}
			else {
				this.removeProject();
			}			
		},
		
		removeProject: function() {
			var projects = new ProjectCollection();
			projects.fetch({
				success: $.proxy(function(projects) {
					var dialog = new RemoveProjectView(projects);
					dialog.on("onOK", $.proxy(function(project) {
						project.destroy({
							success: $.proxy(this.onSuccessRemoveProject, this),
							error: $.proxy(this.onErrorRemoveProject, this)
						});
					}, this));
					this.node.append(dialog.$el);
					dialog.render();
				}, this),
				error: $.proxy(this.onErrorRemoveProject, this)
			});
		},
		
		onSuccessRemoveProject: function(project) {
			var dialog = new ConfirmView("Project removed successfully.", ConfirmView.style.MESSAGE);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onErrorRemoveProject: function() {
			var dialog = new ConfirmView("Project removed error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},		
		
		onSetupProject: function() {
			var dialog = new SetupProjectView(this.project.get("settings"), this.pages);
			dialog.on("onOK", $.proxy(function(settings) {
				this.project.set("settings", settings);
			}, this));
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onNewPage: function() {
			var dialog = new NewPageView();
			dialog.on("onOK", $.proxy(function(name) {
				this.pages.create(new PageModel({"name": name}), {
					success: $.proxy(function(page) {
						page.fetch({
							success: $.proxy(this.onSuccessNewPage, this),
							error: $.proxy(this.onErrorNewPage, this)
						});
					}, this),
					error: $.proxy(this.onErrorNewPage, this)
				});
			}, this));
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onSuccessNewPage: function(page) {
			this.pages.add(page);
			this.view.addPage(page);
		},
		
		onErrorNewPage: function() {
			var dialog = new ConfirmView("Page created error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();			
		},
		
		onRemovePage: function() {
			var dialog = new ConfirmView("Are you sure to remove this page?", ConfirmView.style.CONFIRM);
			dialog.on("onOK", $.proxy(function() {
				this.currentPage.destroy({
					success: $.proxy(this.onSucccessRemovePage, this),
					error: $.proxy(this.onErrorRemovePage, this)
				});
			}, this));
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onSucccessRemovePage: function() {
			this.view.removePage(this.currentPage);
			this.currentPage = null;

			var dialog = new ConfirmView("Page removed successfully.", ConfirmView.style.MESSAGE);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onErrorRemovePage: function() {
			var dialog = new ConfirmView("Page removed error.", ConfirmView.style.ALERT);
			this.node.append(dialog.$el);
			dialog.render();
		},
		
		onUndo: function() {
			this.parentController.mobileController.undoAction();
		},
		
		onRedo: function() {
			this.parentController.mobileController.redoAction();
		},
		
		onCopyComponent: function() {
			this.parentController.mobileController.copyComponent();
		},

		onCutComponent: function() {
			this.parentController.mobileController.cutComponent();
		},
		
		onPasteComponent: function() {
			this.parentController.mobileController.pasteComponent();
		},
		
		onRemoveComponent: function() {
			this.parentController.mobileController.removeSelectedComponent();
		},
		
		onSelectPage: function(page) {
			if(this.currentPage == page) {
				return;
			}
			this.currentPage = page;
			this.parentController.mobileController.loadComponents(this.currentPage.get("components"));
		},
		
		selectComponent: function(component) {
			//TODO: when select component from mobile canvas, sync to select component on project tree
		},
		
		unselectComponent: function() {
			//TODO: when unselect component from mobile canvas, sync to unselect component on project tree
		},
		
		addComponent: function(component, index, container) {
			//TODO: decide if need to add component in the project tree
		},
		
		setComponents: function(json) {
			this.currentPage.set("components", json);
		},
		
		onRunProject: function() {
			this.parentController.runController.startApp(this.project);
		},
		
		onDeployProject: function() {
			this.parentController.runController.deployApp(this.project);
		},

		onTestProject: function() {
			this.parentController.runController.testApp(this.project);
		},

		getProjectInfo: function() {
			return {
				appName: this.project.get("name") || "",
				appFullName: this.project.get("settings").appFullName || "",
				appDescription: this.project.get("settings").appDescription || "",
				appAuthor: this.project.get("settings").appAuthor || "",
				appTouchIcon: this.project.get("settings").appTouchIcon || "",
				appStartupImage: this.project.get("settings").appStartupImage || "",
				appDefaultPageName: this.project.get("settings").appDefaultPageName || "",
				pages: this.pages || []
			};
		}
	});
	return ProjectController;
});