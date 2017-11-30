define(["jquery", "underscore", "backbone", "utilities", "formbuilder", "config", "router",  "moment", "mailcheck","backbone-forms", 'text!templatePath/email_template.html', 'loader'],
       function($, _, Backbone, Utilities, FormBuilder, Config, Router, Moment, MailCheck, BackboneForms, ComponentEmailTemplate, PageLoader) {
    
    var EmailView = Backbone.View.extend({
        typeRegex: { 
          email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		},
        
        render: function() {
            var that = this;
			
			var emailValidators = [ that.typeRegex.email ];
			if(this.model.get('required')) {
				emailValidators.push('required');
			}
			
            this.form = new BackboneForms({
                template: _.template(ComponentEmailTemplate),
                model: this.model,
                templateData: {
                    show_unable_to_use: this.model.get('show_unable_to_use'),
					required: this.model.get("required")
                },
                schema: {	
					email_address: {
						type: 'Text', 
						editorAttrs: {id: 'email-address', maxlength: Config.MAXLENGTHS.email }, 
						editorClass: 'form-control input-max-width400 ', 
						validators: emailValidators
					},
					reasonNotUsingEmail: {
						type: 'TextArea', 
						editorAttrs: {id: 'reason-not-using-email', rows: 4, maxlength: Config.MAXLENGTHS.email_not_using_reason }, 
						editorClass: 'form-control', 
						validators: ['required']
					}	
				}
            }).render();

			FormBuilder.clientSideClearSetup(this.form);
			FormBuilder.removeEnterKeySubmit(this.form);	
			
			this.form.on('email_address:blur', function(form, editor) {
                var ele = editor.$el;
				that.checkEmailInput(ele);
            });
			
			
            this.$el.html(this.form.el);
			
            this.form.delegateEvents();
                
            return this;
        },
        
        
        ///// TODO: These functions are from PageView - maybe refactor to GenericView, or even to Utilities
        getErrorBlock: function(editor_ele) {
            return editor_ele.closest('.form-group').find('.error-block');
        },
	
		
		events: {

			'click .drs-mailcheck-link': function(event) {
				
				event.preventDefault();
				
				var email_to_use = this.$("#mailcheck-suggestion-link").html();

				this.model.set("email_address", email_to_use);				
				this.render();
				//this.init_state();
							
				return false;

			},
			
			
			'click .btn-add-waiver': function(event) {
				var that = this;
				
				event.preventDefault();
				
				if (this.validatePage()) {
					
					$("#addTechnologyWaiver").modal("hide");
					that.model.trigger("unableToUseEmail", this.model);
					that.model.set("required", false);
					that.model.set("show_unable_to_use", false);
					that.model.set("email_address", this.form.$('#email-address').val()); // Save to model
				}
	
				return false;
			},
			'hidden.bs.modal': function() {
				var that = this;
				that.render();
				this.init_state();
			}
		
		},
	
		checkEmailInput: function(e) {
			
			e.mailcheck({
				suggested: function(element, suggestion) {
					this.$("#mailcheck-suggestion-link").html(suggestion.full);
					this.$("#email-suggestion").slideDown(400);
				},
				empty: function () {
					this.$("#email-suggestion").slideUp();
				}
			});
		
		},
		

        validatePage: function() {
            var that = this;
            		
			var error_obj = this.form.validate();
			var isValid = true;
			
            _.each(_.keys(error_obj), function(model_key) {
				
				if(model_key === "reasonNotUsingEmail") {
				
					isValid = false;
					
					var input_id = that.form.schema[model_key].editorAttrs.id,
						ele = that.form.$('#'+input_id),
						form_group = ele.closest('.form-group'),
						error_label = form_group.find('.error-label');
					
                 	var error_message = error_obj[model_key].message +
                            ((error_label.length > 0)? error_label.text() : model_key);  

					form_group.addClass('has-error');
					
					that.getErrorBlock(ele).text(error_message);
					
					$("#addTechnologyWaiver textarea").first().focus();
                	
				}
            });
			
			
			return isValid;
			
        },

		
		
    });

   return EmailView;

	
	
	

	
	
	
	
	
	
	
	
	
	
});
