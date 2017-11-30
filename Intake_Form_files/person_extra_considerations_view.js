define(["jquery", "underscore", "backbone", "constants", "utilities", "formbuilder", "config", "router", "moment", "backbone-forms", 'text!templatePath/person_extra_considerations_template.html', 'loader'],
       function($, _, Backbone, Constants, Utilities, FormBuilder, Config, Router, Moment, BackboneForms, ComponentPersonExtraConsiderationsTemplate, PageLoader) {
    
    var PersonExtraConsiderationsView = Backbone.View.extend({
		
        render: function() {

            var that = this,
				isOtherSelected = $.inArray("Other", this.model.get('special_accomodations')) >= 0 ? true : false;
			
            this.form = new BackboneForms({
                template: _.template(ComponentPersonExtraConsiderationsTemplate),
                model: this.model,
				templateData: {
					isOtherSelected: isOtherSelected
				},
                schema: {
					special_accomodations: {
						type: "Checkboxes", 
						editorAttrs: {id: 'special-accomodation'}, 
						editorClass: 'radio radio-vertical', 
						options: Constants.SPECIAL_ACCOMODATION_OPTIONS	
					},
					special_accomodation_other_text: {
						type: 'Text', 
						editorAttrs: {id: 'other-special-accomodation', maxlength: Config.MAXLENGTHS.special_accomodation_other }, 
						editorClass: 'form-control input-max-width400 ', 
						validators: ['required']
					},
					is_under_19: {
						type: "Radio", 
						editorAttrs: {id: 'under-19'}, 
						editorClass: 'radio radio-responsive', 
						validators: ['required'], 
						options: Constants.NO_YES_OPTIONS	
					}	
				}
            }).render();
			
			
            FormBuilder.clientSideClearSetup(this.form);
			FormBuilder.removeEnterKeySubmit(this.form);

		
			this.form.on('special_accomodations:change', function(form, editor) {
                var ele = editor.$("input[type=checkbox][value='Other']:checked");
				var show = (ele.val() === "Other") ? "true" : "false";
                FormBuilder.containerToggleFadeInOut($('#other-accomodation-form'), show);
            });
            
			
            this.$el.html(this.form.el);
            this.form.delegateEvents();
   		
            return this;
        },
        	
	
    });

   return PersonExtraConsiderationsView;

});
