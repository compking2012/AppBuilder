			  
		/*getComponent: function(node) {
			for(var i=0; i<this.components.length; i++) {
				var component = this.components[i];
				if(component.node.is(node)) {
					return component;
				}
			}
			return null;
		},
		
		getParentContainer: function(node) {
			var parent = node.parent();
			for(var i=0; i<this.components.length; i++) {
				var component = this.components[i];
				if(component.isNode(parent)) {
					return component;
				}
			}
			return null;
		},*/

		/*enableSortable: function(component) {
			var parentContainer = component.getParentContainer();
			if(!parentContainer.hasClass("ui-sortable")) {
				parentContainer.sortable({
					tolerance: "pointer",
					cursor: "move",
					cancel: "",
					appendTo: "body",
					connectWith: ".ui-sortable",
					zIndex: 9999,
					sort: $.proxy(this.onSort, this),
				    receive: $.proxy(this.onSortReceive, this),
			    	stop: $.proxy(this.onSortStop, this)				
				});
			}
		},
		
		onSort: function(event, ui) {
			this.trigger("onSort", this.getComponent(ui.item), {x: event.pageX, y: event.pageY});
		},
		
		onSortReceive: function(event, ui) {
			this.trigger("onSortReceive", this.getComponent(ui.item), ui.sender, {x: event.pageX, y: event.pageY});
		},
		
		onSortStop: function(event, ui) {
			this.trigger("onSortStop", this.getComponent(ui.item), {x: event.pageX, y: event.pageY});
		},
    	
    	cancelSort: function(node) {
    		node.sortable("cancel");
    	}*/