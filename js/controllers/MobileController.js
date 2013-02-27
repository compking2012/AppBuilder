define([
	"jquery", "underscore", "backbone", "mvc",
	"views/MobileView", "views/ConfirmView"
], function($, _, Backbone, MVC, MobileView, ConfirmView) {
	var MobileController = AppBuilder.Controller.extend({
		
		rootContainer: null,
		selectedContainer: null,
		selectedComponent: null,
		clipboard: {
			pages: [],
			components: []
		},
		
		dnd: {
			isDragDropping: false,
			sortIndex: 0,
			shimComponent: null
		},

		actions: {
			undoStack: [],
			redoStack: []
		},
		
		sort: {
			startIndex: 0,
			sortIndex: 0,
			isSorting: false,
			component: null,
			container: null
		},
		
		routes: {
			"": "showMainView"
		},
		
		initialize: function(node, parentController) {
			AppBuilder.Controller.prototype.initialize.call(this, node, parentController);
		},
		
		showMainView: function() {
			this.on("onDropOver", $.proxy(this.onDropOver, this));
			this.on("onDropOut", $.proxy(this.onDropOut, this));
			this.on("onDrop", $.proxy(this.onDrop, this));
			this.on("onMouseMove", $.proxy(this.onMouseMove, this));
			this.on("onResize", $.proxy(this.onResize, this));
			this.on("onStopResize", $.proxy(this.onStopResize, this));
			this.on("onPointSelect", $.proxy(this.onPointSelect, this));
			this.on("onUnselect", $.proxy(this.onUnselect, this));
			this.on("onStartSort", $.proxy(this.onStartSort, this));
			this.on("onSort", $.proxy(this.onSort, this));
			this.on("onStopSort", $.proxy(this.onStopSort, this));
			this.view = new MobileView();
			this.view.on("onSelect", $.proxy(this.onSelect, this));
			this.view.on("onScroll", $.proxy(this.onScroll, this));
			this.node.append(this.view.$el);
			this.view.render();
		},

		setUniqueID: function(component) {
			var type = component.getType();
			var components = this.parentController.componentLibraryController.getAllComponents(this.rootContainer);
			var found = true;
			var id = 1;		// increment from 1
			var myID = "";
			while(found) {
				found = false;
				myID = type + id;
				for(var i=0; i<components.length; i++) {
					var item = components[i];
					if(item.getProperty("ID").value == myID) {
						found = true;
						break;
					}
				}
				if(found) {
					id++;
				}
			}
			component.setPropertyValue("ID", myID);
		},
		
		onDropOver: function() {
		    this.dnd.isDragDropping = true;
		    this.dnd.sortIndex = 0;
		},
		
		onDropOut: function() {
			this.dnd.isDragDropping = false;
		    this.dnd.sortIndex = -1;
		    if(this.dnd.shimComponent) {
		    	this.dnd.shimComponent.remove();
		    	this.dnd.shimComponent = null;
		    }
	    	this.view.hideShim(false);
		    this.selectedContainer = null;
		},
		
		onDrop: function(componentClass, point) {
		    index = this.dnd.sortIndex;
		    container = this.selectedContainer;
		    this.onDropOut();

		    var component = this.parentController.componentLibraryController.getComponentFromClass(componentClass);
		    if(!component.isAcceptable(container)) {
		    	component.destroy();
		    	component = null;
		    	return;
		    }
		    component.classInfo = {
		    	id: componentClass.model["id"],
		    	component: componentClass.model["component"],
		    	library: componentClass.model["library"]
		    };
		    this.setUniqueID(component);
		    
		    if(!this.rootContainer) {
		    	this.rootContainer = component;
			}

			this.addComponent(component, index, container, true);
			//Notify project controller
			this.parentController.projectController.addComponent(component, index, container);
			this.onSelect(component);
			this.saveComponents();
		},
		
		onMouseMove: function(componentClass, point) {
		    if(!this.dnd.isDragDropping) {
		    	return;
		    }
			if(!this.dnd.shimComponent) {
				this.dnd.shimComponent = this.parentController.componentLibraryController.getComponentFromClass(componentClass);
			}
		    
		    var container = this.getContainerWithMouse(this.dnd.shimComponent, this.rootContainer, point);
		    if(container) {
		    	this.selectedContainer = container;
		    }

		    this.dnd.sortIndex = this.view.showShim(false, this.dnd.shimComponent, container, point);
			if(this.selectedComponent) {
				this.parentController.canvasController.resizeComponent(this.selectedComponent);
			}
		},
		
		getContainerWithMouse: function(component, container, point) {
			if(!container || !container.isContainer) {
				return null;
			}
			for(var i=0; i<container.getChildrenCount(); i++) {
				var child = container.getChild(i);
				if(child.isContainer && child.containsPoint(point) && component.isAcceptable(child)) {
					var c = this.getContainerWithMouse(component, child, point);
					if(c) {
						return c;
					}
				}
			}

			if(container.containsPoint(point) && component.isAcceptable(container)) {
				return container;
			}
			return null;
		},
		
		getComponentWithMouse: function(container, point) {
			if(!container) {
				return null;
			}
			for(var i=0; i<container.getChildrenCount(); i++) {
				var child = container.getChild(i);
				if(child.isContainer) {
					var c = this.getComponentWithMouse(child, point);
					if(c) {
						return c;
					}
				}
				else {
					if(child.containsPoint(point)) {
						return child;
					}
				}
			}
			if(container.containsPoint(point)) {
				return container;
			}
			return null;
		},
		
		onPointSelect: function(point) {
			var component = this.getComponentWithMouse(this.rootContainer, point);
			if(component) {
				this.onSelect(component);
			}
		},
		
		onScroll: function(component) {
			if(component.hasChild(this.selectedComponent)) {
				this.parentController.canvasController.resizeComponent(this.selectedComponent);
			}
		},
		
		onSelect: function(component) {
			this.selectedComponent = component;
			this.parentController.canvasController.selectComponent(component);
			this.parentController.projectController.selectComponent(component);
			this.parentController.propertyController.showProperties(component);
			this.parentController.eventController.showEvents(component);
		},
		
		onUnselect: function() {
			this.selectedComponent = null;
			this.parentController.canvasController.unselectComponent();
			this.parentController.projectController.unselectComponent();
			this.parentController.propertyController.clearProperties();
			this.parentController.eventController.clearEvents();
		},
		
		onStartSort: function(point, position) {
			this.sort.isSorting = true;
			this.sort.component = this.selectedComponent;
			this.sort.startIndex = this.selectedComponent.getIndex();
			this.sort.container = this.selectedComponent.getParent();
			this.sort.component.setNodeCSS("position", "absolute");
			this.sort.component.setNodeCSS("left", position.left);
			this.sort.component.setNodeCSS("top", position.top);
		},
		
		onSort: function(point, position) {
			this.sort.component.setNodeCSS("left", position.left);
			this.sort.component.setNodeCSS("top", position.top);
		    var container = this.getContainerWithMouse(this.sort.component, this.rootContainer, point);
		    this.sort.sortIndex = this.view.showShim(true, this.sort.component, container, point);
		},
		
		onStopSort: function(point, position) {
			//TODO: should be restored as the original properties
			this.sort.component.setNodeCSS("position", "");
			this.sort.component.setNodeCSS("left", "");
			this.sort.component.setNodeCSS("top", "");
			var container = this.getContainerWithMouse(this.sort.component, this.rootContainer, point);
			if(container) {
			    container.moveChild(this.sort.component, this.sort.sortIndex);
			    this.saveComponents();
			}
			else {
				this.view.cancelSort(this.sort.container, this.sort.component, this.sort.startIndex);
			}
		    this.view.hideShim(true);
			this.onSelect(this.sort.component);
		    this.sort.isSorting = false;
		    this.sort.component = null;
		    this.sort.container = null;
		    this.sort.startIndex = 0;
		    this.sort.sortIndex = 0;
		},
		
		loadComponents: function(json) {
			this.onUnselect();
			this.clearComponents();
			
			if(json.length == 0) {
				return;
			}
			var rootJson = json[0];
			this.rootContainer = this.loadComponent(rootJson, null);
		},
		
		loadComponent: function(json, container) {
			var component = this.parentController.componentLibraryController.getComponentFromClassInfo(json.classInfo);
			this.addComponent(component, -1, container, false);
			component.deserialize(json);
			
			$.each(json.children, $.proxy(function(index, childJson) {
				this.loadComponent(childJson, component);
			}, this));
			return component;
		},
		
		saveComponents: function() {
			if(!this.rootContainer) {
				this.parentController.projectController.setComponents([]);
			}
			else {
				var json = this.rootContainer.serialize();
				this.saveComponent(json, this.rootContainer);
				this.parentController.projectController.setComponents([json]);
			}
		},
		
		saveComponent: function(json, container) {
			$.each(container.children, $.proxy(function(index, child) {
				var childJson = child.serialize();
				json.children.push(childJson);
				this.saveComponent(childJson, child);
			}, this));
		},
		
		clearComponents: function() {
			this.rootContainer = null;
			this.selectedComponent = null;
			this.selectedContainer = null;
			this.view.clearComponents();
		},
		
		addComponent: function(component, index, container, record) {
			if(record) {
				this.recordAction({
					type: "ADDCOMPONENT",
					revoke: "REMOVECOMPONENT",
					component: component,
					container: container,
					index: index,
					json: component.serialize()
				});
			}
			this.view.addComponent(component, index, container);
		},
		
		copyComponent: function() {
			this.clipboard.components.push(this.selectedComponent);  
		},
		
		cutComponent: function() {
			this.copyComponent();
			this.removeComponent(this.selectedComponent, true);
		},
		
		pasteComponent: function() {
			if(this.selectedComponent.isContainer) {
				$.each(this.clipboard.components, $.proxy(function(index, component) {
					var newComponent = this.parentController.componentLibraryController.getComponentFromClassInfo(component.getClassInfo());
					this.setUniqueID(newComponent);
					this.addComponent(newComponent, -1, this.selectedComponent, true);
					this.saveComponents();
				}, this));
			}
			else {
				var dialog = new ConfirmView("Unable to paste here.", ConfirmView.style.ALERT);
				this.node.append(dialog.$el);
				dialog.render();
			}
		},
		
		removeSelectedComponent: function() {
			this.removeComponent(this.selectedComponent, true);
			this.onUnselect();			
		},
		
		removeComponent: function(component, record) {
			if(record){
				this.recordAction({
					type: "REMOVECOMPONENT",
					revoke: "ADDCOMPONENT",
					component: component,
					container: component.getParent(),
					index: component.getIndex(),
					json: component.serialize()
				});
			}			
			component.destroy();
			this.saveComponents();
		},
		
		resizeComponent: function(component, size) {
			this.parentController.propertyController.setPropertyValue("Width", size.width + "px");
			this.parentController.propertyController.setPropertyValue("Height", size.height + "px");
			this.parentController.canvasController.resizeComponent(component);
		},
		
		onResize: function(position, size) {
			this.resizeComponent(this.selectedComponent, size);
		},
		
		onStopResize: function(oldPosition, oldSize, newPosition, newSize) {
			this.recordAction({
				type: "RESIZECOMPONENT",
				revoke: "UNRESIZECOMPONENT",
				component: this.selectedComponent,
				oldPosition: oldPosition,
				oldSize: oldSize,
				newPosition: newPosition,
				newSize: newSize
			});

			this.resizeComponent(this.selectedComponent, newSize);
			this.saveComponents();
		},
		
		undoAction: function() {
			var action = this.actions.undoStack.pop();
			if(action) {
				this.actions.redoStack.push(action);
				this.executeAction(true, action);
			}
			if(this.actions.undoStack.length == 0) {
				//TODO: disable the menu item
			}
		},
		
		redoAction: function() {
			var action = this.actions.redoStack.pop();
			if(action) {
				this.actions.undoStack.push(action);
				this.executeAction(false, action);
			}
			if(this.actions.redoStack.length == 0) {
				//TODO: disable the menu
			}
		},
		
		recordAction: function(action) {
			this.actions.redoStack = [];
			this.actions.undoStack.push(action);
			//TODO: enable/disable the menu
		},
		
		executeAction: function(undo, action) {
			var invoke = (undo ? action.revoke : action.type);
			if(invoke == "ADDCOMPONENT") {
				var component = action.component;
				var container = action.container;
				var index = action.index;
				var json = action.json;
				component.classInfo = json.classInfo;
				component.generateUICode($);
				this.addComponent(component, index, container, false);
				component.deserialize(json);
				this.onSelect(component);
			}
			else if(invoke == "REMOVECOMPONENT") {
				var component = action.component;
				this.removeComponent(component, false);
				this.onUnselect();
			}
			else if(invoke == "RESIZECOMPONENT") {
				var component = action.component;
				var newSize = action.newSize;
				this.onSelect(component);
				this.resizeComponent(component, newSize);
			}
			else if(invoke == "UNRESIZECOMPONENT") {
				var component = action.component;
				var oldSize = action.oldSize;
				this.onSelect(component);
				this.resizeComponent(component, oldSize);
			}
		}
	});
	return MobileController;
});