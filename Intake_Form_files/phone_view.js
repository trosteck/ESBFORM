define(["jquery", "underscore", "backbone", "utilities", "formbuilder", "config", "backbone-forms", 'text!templatePath/phone_template.html', 'loader'],
       function($, _, Backbone, Utilities, FormBuilder, Config, BackboneForms, PhoneTemplate, PageLoader) {
    
    var ComponentPhoneView = Backbone.View.extend({
        typeRegex: { 
			phone: /^\d{8,15}$/, 
		},
		
		initialize: function() {
            this.listenTo(this.model, 'change:required', function() {
                this.model.set({
                    phone_number: this.$('input[name=phone_number]').val(),
                    phone_extension: this.form.$('input[name=phone_extension]').val()
                });
                this.render();
            });
		},
        
        render: function() {
            var phoneValidators = [ FormBuilder.getPhoneValidator(this) ];
			if(this.model.get('required')) {
				phoneValidators.push('required');
			}
			
            this.form = new BackboneForms({
                template: _.template(PhoneTemplate),
                model: this.model,
                templateData: {
                    required: this.model.get('required'),
					show_remove: this.model.get('show_remove'),
                    is_first: this.model.get('is_first')
                },
                schema: {
					phone_number: {
						type: 'Text', 
						editorAttrs: {id: 'phone_number', maxlength: Config.MAXLENGTHS.phone_number }, 
						editorClass: 'form-control input-max-width250', 
						validators: phoneValidators						
					},
                    phone_extension: {
						type: 'Text', 
						editorAttrs: {id: 'phone_extension', maxlength: Config.MAXLENGTHS.phone_extension }, 
						editorClass: 'form-control input-max-width75-static'
					}
	
				}
            }).render();
			
            FormBuilder.clientSideClearSetup(this.form);
			FormBuilder.removeEnterKeySubmit(this.form);	
		
			
            this.$el.html(this.form.el);
            this.form.delegateEvents();
  
            return this;
        },
		
		
		
 		events: {
			'click .btn-remove-phone': function(event) {
				event.preventDefault();
				this.model.trigger("removePhone", this.model);
				return false;
			}
		},

		
    });

   return ComponentPhoneView;

});
