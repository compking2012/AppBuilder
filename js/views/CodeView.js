define([
    "jquery", "jqueryui", "underscore", "backbone", "mvc", "codemirror", "codemirrorui", "codemirrorjsmode",
    "text!views/CodeView.html"
], function($, $ui, _, Backbone, MVC, _CodeMirror, _CodeMirrorUI, _CodeMirrorJSMode, template) {
	var CodeView = AppBuilder.View.extend({
		template: template,
		
		event: null,
		editor: null,
		codeTitle: null,
		
		events: {
			
		},
		
		initialize: function(codeTitle) {
			AppBuilder.View.prototype.initialize.call(this);
			this.codeTitle = codeTitle;
		},
		
		render: function() {
			this.editor = new CodeMirrorUI(this.getElement("#code").get(0), {
				path: configuration.staticPath + "/js/",
				imagePath: configuration.staticPath + "/js/libs/codemirror/ui/images/silk",
				searchMode: "inline",
				buttons: ["save", "undo", "redo", "jump", "reindent", "about"],
				saveCallback: $.proxy(this.onSaveCode, this)
			}, {mode: "javascript"});
			this.editor.mirror.setOption("theme", "eclipse");
		},
		
		onSaveCode: function() {
			this.trigger("onSaveCode", this.event, this.editor.mirror.getValue());
		},
		
		openCode: function(event) {
			this.event = event;
			if(event.handler) {
				this.editor.mirror.setValue(event.handler);
			}
			else {
				this.editor.mirror.setValue("");
			}
		},
		
		getCodeTitle: function() {
			return this.codeTitle;
		}
	});
	return CodeView;
});