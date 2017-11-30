define(["jquery", "underscore", "backbone", "constants", "formbuilder", "utilities", "config", "router", "moment", "backbone-forms", 'text!templatePath/address_template.html', 'loader'],
       function($, _, Backbone, Constants, FormBuilder, Utilities, Config, Router, Moment, BackboneForms, ComponentAddressTemplate, PageLoader) {
    
    var AddressView = Backbone.View.extend({
        typeRegex: { 
			postal_code: /[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d/
		},		

		initialize: function(){
			this.model.bind("change", this.render, this);
		},
		
        render: function() {
            var that = this;
            this.form = new BackboneForms({
                template: _.template(ComponentAddressTemplate),
                model: this.model,
				templateData: {
					CountrySelected: this.model.get('country')
				},
                schema: {	

					address_line_1: {
						type: 'Text', 
						editorAttrs: {id: 'address-line-1', maxlength: Config.MAXLENGTHS.addressLine1 }, 
						editorClass: 'form-control', 
						validators: ['required']
					},
                    address_line_2: {
						type: 'Text', 
						editorAttrs: {id: 'address-line-2', maxlength: Config.MAXLENGTHS.addressLine2 }, 
						editorClass: 'form-control'
					},
                    country: {
						type: 'Select', 
						editorAttrs: {id: 'mail-country'}, 
						editorClass: 'form-control', 
						validators: ['required'], 
						options: Constants.COUNTRY_OPTIONS
					},
                    
                    other_country: {
                        type: 'Text', 
						editorAttrs: {id: 'mail-other-country', maxlength: Config.MAXLENGTHS.address_country_text }, 
						editorClass: 'form-control', 
						validators: ['required']
                    },
                    
                    state: {
                        type: 'Select',
                        editorAttrs: {id: 'mail-state-dropdown'},
                        editorClass: 'form-control',
                        validators: ['required'],
                        options: Constants.US_STATES
                    },
                    
                    other_region: {
						type: 'Text', 
						editorAttrs: {id: 'mail-province', maxlength: Config.MAXLENGTHS.address_province_text }, 
						editorClass: 'form-control', 
						validators: ['required']
					},
                    
                    province: {
						type: 'Select', 
						editorAttrs: {id: 'mail-province-dropdown'}, 
						editorClass: 'form-control', 
						validators: ['required'], 
						options: Constants.CANADA_PROVINCES
					},
                    
                    city: {
						type: 'Text', 
						editorAttrs: {id: 'mail-city',  maxlength: Config.MAXLENGTHS.address_city }, 
						editorClass: 'form-control input-max-width400', 
						validators: ['required']
					},
                    
                    postal_code: {
						type: 'Text', 
						editorAttrs: {id: 'mail-postal-code', maxlength: Config.MAXLENGTHS.postal_code }, 
						editorClass: 'form-control input-max-width100', 
						validators: ['required', that.typeRegex.postal_code]
					}
					
				}
            }).render();
			
	
            FormBuilder.clientSideClearSetup(this.form);
			FormBuilder.removeEnterKeySubmit(this.form);	
			
			
			/*
			this.form.on('country:change', function(form, editor) {
				this.model.set('country', editor.$el.val());
			});
			
			
			this.form.on('country:change', function(form, editor) {
				
                var provinceTextEditor = form.fields.other_region,
                    countryTextEditor = form.fields.other_country,
                    provinceDropdownEditor = form.fields.province,
                    stateDropdownEditor = form.fields.state,
                    postalCodeEditor = form.fields.postal_code,
                    countryTextEle = $('#'+countryTextEditor.schema.editorAttrs.id),
                    provinceTextEle = $('#'+provinceTextEditor.schema.editorAttrs.id),
                    provinceDropdownEle = $('#' +provinceDropdownEditor.schema.editorAttrs.id),
                    stateDropdownEle = $('#' +stateDropdownEditor.schema.editorAttrs.id),
                    postalCodeEle = $('#'+postalCodeEditor.schema.editorAttrs.id);
                
                if (editor.$el.val() === 'Other') {
                    var visibleElement = stateDropdownEle.is(':visible') ? stateDropdownEle : provinceDropdownEle;
                    $(visibleElement).closest('.row').fadeOut({duration: 200, complete: function() {
                        provinceTextEle.closest('.row').fadeIn({duration: 200});
                        countryTextEle.closest('.row').fadeIn({duration: 200});
                    }});
                    
                    postalCodeEle.closest('.row').find('.control-label').text('Postal / Zip Code ')
                        .removeClass('required').addClass('optional');
                    postalCodeEle.closest('.row').find('.error-label').text('postal or zip code');
                    postalCodeEditor.editor.validators = [];
                    postalCodeEditor.validators = [];
                    
                } else if (editor.$el.val() === 'US') {
                    countryTextEle.closest('.row').fadeOut({duration: 200});
                    var visibleElement = provinceDropdownEle.is(':visible') ? provinceDropdownEle : provinceTextEle;
                    $(visibleElement).closest('.row').fadeOut({duration: 200, complete: function() {
                        stateDropdownEle.closest('.row').fadeIn({duration: 200});
                    }});
                    
                    postalCodeEle.closest('.row').find('.control-label').text('Zip Code ')
                        .addClass('required').removeClass('optional');
                    postalCodeEle.closest('.row').find('.error-label').text('zip code');
                    postalCodeEditor.editor.validators = [];
                    postalCodeEditor.validators = [];
                    
                } else if (editor.$el.val() === 'Canada') {
                    countryTextEle.closest('.row').fadeOut({duration: 200});
                    var visibleElement = stateDropdownEle.is(':visible') ? stateDropdownEle : provinceTextEle;
                    $(visibleElement).closest('.row').fadeOut({duration: 200, complete: function() {
                        provinceDropdownEle.closest('.row').fadeIn({duration: 200});
                    }});
                    
                    postalCodeEle.closest('.row').find('.control-label').text('Postal Code ')
                        .addClass('required').removeClass('optional');
                    postalCodeEle.closest('.row').find('.error-label').text('postal code');
                    postalCodeEditor.editor.validators = ['required', that.typeRegex.postal_code];
                    postalCodeEditor.validators = ['required', that.typeRegex.postal_code];
                }
                
                countryTextEle.closest('.form-group').removeClass('has-error').find('.error-block').text('');
                provinceTextEle.closest('.form-group').removeClass('has-error').find('.error-block').text('');
                provinceDropdownEle.closest('.form-group').removeClass('has-error').find('.error-block').text('');
                stateDropdownEle.closest('.form-group').removeClass('has-error').find('.error-block').text('');
                postalCodeEle.closest('.form-group').removeClass('has-error').find('.error-block').text('');
            });
*/
		
            this.$el.html(this.form.el);
            //this.form.delegateEvents();
            
            return this;
        },
		
		updateCountry: function(e) {
			
			var ele = $(e.target),
				eleId = e.target.id,
				value = ele.val();
			if(eleId === "mail-country") {
				this.model.set('country', value);
			}
		},
		
		events:  {
			"change": "updateCountry"
		}
     
		
    });

   return AddressView;

});
