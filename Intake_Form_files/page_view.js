define(["jquery", "underscore", "backbone", "utilities", 'router', 'loader', 'es6-shim'], function($, _, Backbone, Utilities, Router, PageLoader) {
    var PageView = Backbone.View.extend({

        el: $('#page-contents'),

        initialize: function() {
            var that = this;
            this.$el.show(250);
        },

        events: {
            'click submit': function(event) {
                // Ignore a "submit" event to prevent keyboard submits and
                // force Next button clicks
                event.preventDefault();
            }
        },

		
		/*  Use setElement to set up the subviews 
			When you call setElement, the argument passed in will become the new element for the subview (replaces this.el within the subview). 
			It also causes delegateEvents to be called again in the subview so the event listeners are reassigned.
		*/
		assign: function(selector, view) {
			var selectors;
			if (_.isObject(selector)) {
				selectors = selector;
			}
			else {
				selectors = {};
				selectors[selector] = view;
			}
			if (!selectors) return;
			_.each(selectors, function (view, selector) {
				view.setElement(this.$(selector)).render();
			}, this);
		},	
		
		
        init_state: function() {
        },

        renderSidebar: function(pageScope) {
            var sidebarModel = pageScope.model.get('parent').sidebarModel;
            if (sidebarModel && !sidebarModel.get('hidden')) {
                sidebarModel.trigger('renderOnPage', pageScope);
            }
        },
        
        clearPageErrors: function() {
            $('.error-block').text('');
            $('.form-group').removeClass('has-error');
            $('.page-error-block-container').fadeOut({duration: 50});
        },
        
		
		
        getErrorBlock: function(editor_ele) {
            return editor_ele.closest('.form-group').find('.error-block');
        },

        getWarningBlock: function(editor_ele) {
            return editor_ele.closest('.form-group').find('.warning-block');
        },

		
		
        /****** For manipulating functions ******/
        commitFormNoValidate: function(formToCommit) {
            _.each(formToCommit.fields, function(data, model_key) {
                if (data.editor.$el.is(':visible')) {
                    return;
                }
                var val = data.editor.getValue(),
                cleared_val = '';
                if (_.isArray(val)) {
                    cleared_val = new Array(val.length);
                }
                data.editor.setValue(cleared_val);
            });
            
            formToCommit.model.set(formToCommit.getValue());
        },
		
		
        getFormToCommit: function(formToCommit) {
            _.each(formToCommit.fields, function(data) {
                if (data.editor.$el.is(':visible')) {
                    return;
                }
                var val = data.editor.getValue(),
                	cleared_val = '';
                if (_.isArray(val)) {
                    cleared_val = new Array(val.length);
                }
                data.editor.setValue(cleared_val);
            });
            
            return(formToCommit.getValue());
        },
		
		
        
        validateFormAndDisplayErrors: function(formToValidate) {
            var errors = this.validateForm(formToValidate);
            this.displayFormValidationErrors(formToValidate, errors); 
            return errors;
        },
        
        validateForm: function(formToValidate) {
			var error_obj = formToValidate.validate(),
                that = this,
                visible_error_obj = {};

            _.each(_.keys(error_obj), function(model_key) {
                var input_id = formToValidate.schema[model_key].editorAttrs.id,
                    ele = formToValidate.$('#'+input_id),
                    error_label = ele.closest('.error-label');
                if (!ele.is(':visible')) {
                    ele.val('');
                } else {
                    visible_error_obj[model_key] = error_obj[model_key];
                }
            });

            // Re-assign error_obj to only visible errors
            error_obj = visible_error_obj;
            if (!error_obj || _.isEmpty(error_obj)) {
                return null;
            }

            return error_obj;
        },
        
		
		
        // TODO: (CR): I am a wondering about custom error messaging like checking keys for "dispute number".  Check if these things are shared pretty well across pages so that it becomes a good thing.
        displayFormValidationErrors: function(validatedForm, error_obj) {
            var that = this;
            if (!_.isEmpty(error_obj)) {
                this.displayFormErrorHeader();
            }
			
            _.each(_.keys(error_obj), function(model_key) {
                var input_id = validatedForm.schema[model_key].editorAttrs.id,
                    ele = validatedForm.$('#'+input_id),
                    form_group = ele.closest('.form-group'),
                    error_label = form_group.find('.error-label'),
                    error_message;

                form_group.addClass('has-error');
                if (error_obj[model_key].type === 'required' && validatedForm.schema[model_key].type === "Select") {
                    error_obj[model_key].message = "Select an option";
					
				} else if (error_obj[model_key].type === 'required' && validatedForm.schema[model_key].type === "Radio") {
                    error_obj[model_key].message = "Select an option";
					
                } else if (error_obj[model_key].type === 'required' && validatedForm.schema[model_key].type === "Checkboxes") {
                    error_obj[model_key].message = "Confirmation required";
					
                } else if (error_obj[model_key].type === 'required' || error_obj[model_key].type === 'regexp') {
                    // Check special error message handling
                    if (model_key === 'disputeNumber' && !/^.+?\-.+?\-.+?$/.test(ele.val())) {
                        error_obj[model_key].message = 'Enter the full dispute number with dashes';
                    } else {
                        // General regexp invalid field errors
                        error_obj[model_key].message = error_obj[model_key].message +
                            ((error_label.length > 0)? error_label.text() : model_key);    
                    }
                }

                that.getErrorBlock(ele).text(error_obj[model_key].message);
            });
			

        },
        
        displayFormSubmissionError: function(errorMsg) {
            PageLoader.stop();
            $('.page-error-block').text(errorMsg);
            $('#submitted_dialog').modal('hide');

            $('.page-error-block-container').fadeIn({duration: 50, complete: function() {	
				$(this).prev('.error-anchor').scrollintoview({duration: 400, direction: 'vertical'});				
				//$('html, body').animate({ scrollTop: $(this).prev('.error-anchor').offset().top - 150}, 400);
            }});
        },

        displayFormErrorHeader: function() {
			$('.page-error-block').text('Please review and update the errors in the form');
            $('.page-error-block-container').fadeIn({duration: 200});
        },
        
		
		
        /****** End form methods ******/ 

        scrollToFirstErrorMessage: function() {
				
            // Scroll to closest step parent of the first non-empty error message
             var nonEmptyVisibleErrors = _.filter($('.error-block:visible'), function(ele) {
                return $(ele).html() !== '';
            });
            
			
            var firstErrorEle = $(nonEmptyVisibleErrors[0]),
				fromGroup = firstErrorEle.closest(".form-group");
            
            if (fromGroup.find('.error-anchor').length === 0) {
				if(fromGroup.legnth === 0) {
					firstErrorEle.prepend('<div class="error-anchor"></div>');
				} else {
					fromGroup.prepend('<div class="error-anchor"></div>');
				} 
            }
			
            var errorAnchor = $(nonEmptyVisibleErrors[0]).closest(".form-group").find('.error-anchor');
			
            errorAnchor.scrollintoview({duration: 400, direction: 'vertical'});
        },
        
	
		
        setFeedbackMessage: function(parentEle, msgClass, msg) {
            var feedback_ele = parentEle.find('.'+msgClass);
            if (feedback_ele.length === 0) {
                parentEle.append('<div class="'+msgClass+' feedback-message">' + msg + '</div>');
                feedback_ele = parentEle.find('.'+msgClass);
            }

            feedback_ele.html(msg).fadeIn({duration:400}).delay(1000).fadeOut({duration:400});
        },
        
		

		
		
    });

    return PageView;
});
