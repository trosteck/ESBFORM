define(["jquery", "underscore", "backbone", "constants", "utilities", "router", "moment", "backbone-forms", 'text!templatePath/contact_us_communication_template.html', 'loader'],
       function($, _, Backbone, Constants, Utilities, Router, Moment, BackboneForms, ComponentContactUsCommunicationTemplate, PageLoader) {
    
    var ContactUsCommunicationView = Backbone.View.extend({
        
        render: function() {
            this.form = new BackboneForms({
                template: _.template(ComponentContactUsCommunicationTemplate),
                model: this.model,
                schema: {	
					formal_communication: {
						type: "Radio", 
						editorAttrs: {id: 'contact-us-communication-choice'}, 
						editorClass: 'radio radio-responsive', 
						validators: ['required'], 
						options: Constants.CONTACT_US_COMMUNICATION_OPTIONS
					},
				}
            }).render();
			
            this.$el.html(this.form.el);
            this.form.delegateEvents();
 
            return this;
        }
    });

   return ContactUsCommunicationView;

});
