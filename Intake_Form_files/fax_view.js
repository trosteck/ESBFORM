define(["jquery", "underscore", "backbone", "utilities", "formbuilder", "config", "backbone-forms", 'text!templatePath/fax_template.html', 'loader'],
       function($, _, Backbone, Utilities, FormBuilder, Config, BackboneForms, ComponentFaxTemplate, PageLoader) {
    
    var FaxView = Backbone.View.extend({
        typeRegex: { 
			phone: /^\d{8,15}$/, 
		},
		initialize: function() {
            var that = this;
            this.listenTo(this.model, 'change:required', function() {
				this.model.set('fax_number', that.form.$('input').val());
                that.render();
            });
		},
        
        render: function() {
			
			var faxNumberValidators = [ FormBuilder.getPhoneValidator(this) ];
			if(this.model.get('required')) {
				faxNumberValidators.push('required');
			}
			
            this.form = new BackboneForms({
                template: _.template(ComponentFaxTemplate),
                model: this.model,
                templateData: {
                    required: this.model.get('required')
                },
                schema: {
					fax_number: {
						type: 'Text', 
						editorAttrs: {id: 'fax-number', maxlength: Config.MAXLENGTHS.phone_number }, 
						editorClass: 'form-control input-max-width250', 
						validators:faxNumberValidators	
					}
				}
            }).render();
			
			FormBuilder.clientSideClearSetup(this.form);
			FormBuilder.removeEnterKeySubmit(this.form);	
			
            this.$el.html(this.form.el);
            this.form.delegateEvents();

            return this;
        },
		
		
    });

   return FaxView;

});
