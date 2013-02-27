define([
    "jquery", "jqueryui", "jquerytree", "underscore", "backbone", "mvc", 
    "text!views/ProjectView.html"
], function($, $ui, $uitree, _, Backbone, MVC, template) {
	var ProjectView = AppBuilder.View.extend({
		template: template,

		tree: null,
		
		events: {
			
		},
		
		initialize: function() {
			AppBuilder.View.prototype.initialize.call(this);
			this.tree = this.getElement("#tree");
		},
		
		render: function() {
		},
		
		showProject: function(project) {
			if(project) {
				var data = [{
			    	data: {
			    		title: project.get("name"),
			    		attr: {id: "tree_project"},
			    		icon: configuration.staticPath + "/images/project_icon.png"
			    	},
			    	metadata: {type: "project", project: project},
			    	state: "open",
			    	children: [
			    	    {
			    	    	data: {
			    	    		title: "Pages",
			    	    		attr: {id: "tree_pages"},
			    	    		icon: configuration.staticPath + "/images/pages_icon.png"
			    	    	},
			    	    	state: "open",
			    	    	children: []
			    	    },
			    	    {
			    	    	data: {
			    	    		title: "Services",
			    	    		attr: {id: "tree_services"},
		    	    			icon: configuration.staticPath + "/images/services_icon.png"
			    	    	},
			    	    	state: "open",
			    	    	children: []
			    	    }
			    	]
				}];
				
				this.tree.jstree({
					json_data: {
						data: data
					},
					plugins: ["themes", "json_data", "ui"]
				}).bind("select_node.jstree", $.proxy(this.onSelectNode, this));
			}
			else {
				this.tree.empty();
			}
		},
		
		showPages: function(pages) {
			//TODO: clear all page nodes first
			
			//Add pages
			pages.each($.proxy(function(page) {
				this.addPage(page);
			}, this));
		},
		
		showServices: function(services) {
			//Add services
			//TODO: add services in the project tree
		},
		
		onSelectNode: function(event, data) {
			var type = data.rslt.obj.data("type");
			if(type == "project") {
				var project = data.rslt.obj.data("project");
				//this.trigger("onSelectProject", project);
			}
			else if(type == "page") {
				var page = data.rslt.obj.data("page");
				this.trigger("onSelectPage", page);
			}
			else if(type == "component") {
				
			}
		},
		
		addPage: function(page) {
			this.tree.jstree("create_node", "#tree_pages", "inside", {
				data: {
					title: page.get("name"),
					attr: {id: "tree_page_" + page.get("id")},
					icon: configuration.staticPath + "/images/page_icon.png"
				},
				metadata: {type: "page", page: page},
				state: "open"
			}, null, false);
		},
		
		removePage: function(page) {
			this.tree.jstree("delete_node", "#tree_page_" + page.get("id"));
		},
		
		addComponent: function(component) {
			
		},
		
		removeComponent: function(component) {
			
		},
		
		addService: function(service) {
			
		},
		
		removeService: function(service) {
			
		}
	});
	return ProjectView;
});