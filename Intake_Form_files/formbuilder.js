define(["jquery", "underscore", "backbone", "config", "backbone-forms", 'scrollintoview'], 
	   function($, _, Backbone, Config, BackboneForms) {

/*
	Functions used by pages and components to set up forms
	TODO: look into just extending backbone.form so these automatically happen on render
*/
	
    var FormBuilder =  {
	
		
		removeEnterKeySubmit(formToModify) {
            formToModify.on('submit', function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                return false;
            });	
		},
		
		clientSideClearSetup(formToSetup) {
            _.each(formToSetup.fields, function(field) {
                formToSetup.on(field.key+':blur '+field.key+':change', function(form, editor) {
                    var ele = editor.$el;
                    var error_block = ele.closest('.form-group').find('.error-block');
                    error_block.closest('.form-group').removeClass('has-error');
                    error_block.text('');
                });
            });
		},
		
		
        getMinLengthValidator: function(length) {
            return function(value, formValues) {
                return BackboneForms.validators.regexp({regexp: new RegExp('^.{'+length+',}$')})(value, formValues);
            };
        },
        getCheckboxesValidator: function(MINIMUM_NUM_SELECTIONS) {
            return function(value) {
                if (!value || value.length < MINIMUM_NUM_SELECTIONS) {
                    return { message: "Confirmation required" };
                }
            };
        },
        getPhoneValidator: function(parent_scope) {
            function cleanPhone(phone_number) {
                // Removes punctuation from phone number:
                // "- + . , ( ) [ ] <space>
                return phone_number.replace(/[\-\.\,\+\(\)\[\]\s]/g, '');
            }
            return function(value, formValues) {
                var cleaned_value = cleanPhone(value);
                if(!parent_scope.typeRegex.phone.test(cleaned_value)) {
                    return BackboneForms.validators.regexp({regexp: parent_scope.typeRegex.phone})(value, formValues);
                }
            };
        },
		
		
		
		
        containerFadeOutFadeIn: function(containerEle, fadeInEle) {
            if (!fadeInEle.hasClass('hidden-form')) {
                // Element already shown, exit
                return;
            }
            containerEle.animate({'opacity': 0}, {duration: 200, complete: function() {
                containerEle.children().addClass('hidden-form');
                fadeInEle.removeClass('hidden-form');
                containerEle.animate({'opacity': 1}, 200);
            }});
        },
		
		
		containerToggleFadeInOut: function(fadeInEle, showOrHide) {
			
            if (showOrHide === "true") {
                // Element already shown, exit
               	fadeInEle.removeClass('hidden-form');
				
            } else {
				fadeInEle.removeClass('hidden-form').addClass("hidden-form");
			}
            //containerEle.animate({'opacity': 0}, {duration: 200, complete: function() {
                //containerEle.children().addClass('hidden-form');
                //fadeInEle.removeClass('hidden-form');
                //containerEle.animate({'opacity': 1}, 200);
            //}});
		
        },
        
        toPhoneDisplay: function(phone_number) {
            if (phone_number === null || typeof phone_number === "undefined") {
                return phone_number;
            }
            var phone_display = '';
            if (phone_number.length === 11) {
                phone_display = '+' + phone_number.slice(0,1) + ' ';
                phone_number = phone_number.slice(0,-1);
            }
            if (phone_number.length === 10) {
                phone_display = '('+phone_number.slice(0,3)+') '+phone_number.slice(3,6)+'-'+phone_number.slice(6);
            } else {
                phone_display = phone_number;
            }
            
            return phone_display;
        },
        
        toPhoneListDisplay: function(phoneCollectionModel) {
			var display = "";
            console.debug(phoneCollectionModel);
			_.each(phoneCollectionModel, function(phoneModel) {
			//_.each(phoneCollectionModel, function(phoneModel) {
				display += "Phone: " + FormBuilder.toPhoneDisplay(phoneModel.attributes.phone_number) + "<br />";
			});
			return display;
		},
        

    };
    return FormBuilder;
});