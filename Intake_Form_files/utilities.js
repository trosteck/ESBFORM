define(["jquery", "underscore", "backbone", "config", 'scrollintoview'], function($, _, Backbone, Config) {

    /*
        Global variables taken from DRS feedback.js
        Contains functions for custom alerts, confirmation and information windows
    */
    var ALERT_BUTTON_DEFAULT_TEXT = "Ok";
    var CONFIRMATION_PRIMARY_BUTTON_DEFAULT_TEXT = "Continue";
    var CONFIRMATION_SECONDARY_BUTTON_DEFAULT_TEXT = "Cancel";

    var SECONDARY_BUTTON = "" + 
        "<a class='btn btn-default btn-sm'><span class='feedback-button-text'></span></a>";

    var SECONDARY_BUTTON_LINK = "" + 
        "<a class='feedback-action-secondary'><span class='feedback-button-text'></span></a>";	

    var PRIMARY_BUTTON_NO_ICON = "" + 
        "<a class='feedback-action-primary btn btn-primary'><span class='feedback-button-text'></span></a>";	

    var ALERT_CONFIRMATION_TEMPLATE = "" + 
            "<div class='feedback-overlay'></div>" + 
            "<div class='feedback-inner'>" + 
            "	<div class='feedback-vertical-center'>" +  
            "        <div class='feedback-box'>" + 
            "            <div class='feedback-title'></div>" + 
            "            <div class='feedback-text'></div>" + 
            "            <div class='feedback-action'>" + 
            "                " + SECONDARY_BUTTON_LINK +		
            "                " + PRIMARY_BUTTON_NO_ICON +
            "            </div>" + 
            "        </div>" + 
            "	</div>" + 
            "</div>";

    var INFO_WINDOW_TEMPLATE = "" +
            "<div class='infowindow-wrapper'>" + 
            "  <div class='container-fluid infowindow-scroll overthrow'> " +
            "	 <div class='row infowindow-title-wrapper'>" +
            "	    <div class='col-xs-9 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 infowindow-title'></div>" + 
            "       <div class='col-xs-3 pull-right infowindow-close'></div>" + 
            "    </div>" +
            "    <div class='row infowindow-content'>" +
            "    </div>" +
            "  </div>" +
            "</div>";

    /**
  * @param {String} title The title for the alert box
  * @param {String} text The content for the alert box  
  * @param {String} [buttonText="Ok"] The button text is optional..  
  * @param {String} [onCloseFunction=""] The script function for the click event for the button
  */
    function CustomAlert(title, text, buttonText, onCloseFunction) {

        if (typeof title === 'undefined') { title = ''; }
        if (typeof buttonText === 'undefined') { buttonText = ALERT_BUTTON_DEFAULT_TEXT; }
        if (typeof onCloseFunction === 'undefined') { onCloseFunction = function() {}; }

        $(".feedback-container").html(ALERT_CONFIRMATION_TEMPLATE.replace(
                "class='feedback-action'", "class='feedback-action feedback-action-alert'"));

        if(title == '') {
            $(".feedback-title").hide();
        }
        $(".feedback-title").html(title);
        $(".feedback-text").html(text);
        $(".feedback-action .feedback-action-primary").css("float", "none");
        $(".feedback-action .feedback-action-primary").css("min-width", "100px");
        $(".feedback-action .feedback-action-primary").css("text-align", "center");
        $(".feedback-action .feedback-action-primary .feedback-button-text").html(buttonText); 
        $('.feedback-container').show();	
        $('.feedback-action .feedback-action-secondary').hide(); 

        $(".feedback-action .feedback-action-primary").on("click", function () { 
            CloseFeedbackWindow();
            onCloseFunction();
        });

    }


    /**
      * @param {String} title The title for the confirmation box
      * @param {String} text The content for the confirmation box
      * @param {String} primaryButtonText The text for the primay action (gold) button  
      * @param {String} [primaryActionOnClickFunction=""] The click event for the primary button 
      * @param {String} [primaryActionOnClickParams=""] The parameters for the primaryActionOnClickFunction.
            Note: the params MUST be a dictionary / object.
            It will be passed to onClick function as the 'data' attribute of a jQuery Event object.
      * @param {String} [secondaryButtonText="Ok"] The secondary button text is optional.
      * @param {Boolean} [disablePrimaryOnLoad="false"] Option to disable button on load
      * @param {Boolean} [primaryButtonHasIcon="false"] Option to disable button on load
      */
    function CustomConfirm(title, text, primaryButtonText, primaryActionOnClickFunction, primaryActionOnClickParams, secondaryButtonText, disablePrimaryOnLoad, primaryButtonHasIcon) {

        //alert("2");

        // Set default text
        if (typeof primaryButtonText === 'undefined') { primaryButtonText = CONFIRMATION_PRIMARY_BUTTON_DEFAULT_TEXT; }
        if (typeof secondaryButtonText === 'undefined') { secondaryButtonText = CONFIRMATION_SECONDARY_BUTTON_DEFAULT_TEXT; }
        if (typeof primaryActionOnClickParams === 'undefined') { primaryActionOnClickParams = ''; }
        if (typeof disablePrimaryOnLoad === 'undefined') { disablePrimaryOnLoad = false; }
        if (typeof primaryButtonHasIcon === 'undefined') { primaryButtonHasIcon = false; }


        if(disablePrimaryOnLoad == true) {
            $(".feedback-action .es_primary").addClass('es_disabled');
        }

        if(primaryButtonHasIcon == true) {
            var templateWithIcons = ALERT_CONFIRMATION_TEMPLATE.replace(PRIMARY_BUTTON_NO_ICON, PRIMARY_BUTTON_WITH_ICON);
            $(".feedback-container").html(templateWithIcons);
        } else {
            $(".feedback-container").html(ALERT_CONFIRMATION_TEMPLATE);
        }


        // Set text
        $(".feedback-title").html(title);
        $(".feedback-text").html(text);
        $(".feedback-action .feedback-action-primary .feedback-button-text").html(primaryButtonText);
        $(".feedback-action .feedback-action-secondary .feedback-button-text").html(secondaryButtonText);

        // Attach events to buttons
        $(".feedback-action .feedback-action-primary").on("click", primaryActionOnClickParams, primaryActionOnClickFunction); // Add event 
        $(".feedback-action .feedback-action-secondary").on("click", CloseFeedbackWindow); // Add close event 

        // Show Feedback Window
        $('.feedback-container').show();

    }

    function CloseFeedbackWindow() { 

        // Close Window
        $('.feedback-container').hide();

        // Remove events
        $(".feedback-container .feedback-action-primary").unbind();

        // Reset both buttons to visible
        $('.feedback-action .feedback-action-primary').show();
        $('.feedback-action .feedback-action-secondary').show();

        // Reset text
        $(".feedback-title").html();
        $(".feedback-text").html();
        $(".feedback-action .feedback-action-primary .feedback-button-text").html();
        $(".feedback-action .feedback-action-secondary .feedback-button-text").html();

    }

    /**
      * @param {String} divId The ID of the div for the content window
      * @param {String} title The title of the content window - to be displayed to user
      * @param {String} [contentWidth=""] The width of the content, if not set 100%

     */

    function OpenInfoWindow(divId, title, contentWidth, enableClose, useAbsolute) { 

        if (typeof contentWidth === 'undefined') { contentWidth = ''; }
        if (typeof useAbsolute === 'undefined') { useAbsolute = false; }
        if (typeof enableClose === 'undefined') { enableClose = true; }

        // Remove scroll from main window
        $("body").addClass("remove-scroll");
        $("html").addClass("remove-scroll");

        // If the window doesn't exist, create it
        // 
        if ($("#" + divId + " .infowindow-wrapper").find(".infowindow-title").length == 0
            && $("#" + divId + " .infowindow-wrapper-absolute").find(".infowindow-title").length == 0)	{
            var contentInDiv = $("#" + divId).html();

            // Add template
            $("#" + divId).html(INFO_WINDOW_TEMPLATE);

            // Set Content
            $("#" + divId + " .infowindow-content").html(contentInDiv);	
        }

        // Set Title 
        $("#" + divId + " .infowindow-title").html(title);

        // Templates must use absolute, not fixed or else in iOS it jumps around

        if(useAbsolute == true) {
            $("#" + divId).html($("#" + divId).html().replace("class=\"infowindow-wrapper\"", "class=\"infowindow-wrapper-absolute\""));
        } else {
            $("#" + divId).html($("#" + divId).html().replace("class=\"infowindow-wrapper-absolute\"", "class=\"infowindow-wrapper\""));
        }	

        // Otherwise, turn the given divId into an InfoWindow

        if (contentWidth != '') {        
            $("#" + divId + " .infowindow-content").css("max-width", contentWidth);
            $("#" + divId + " .infowindow-title-wrapper").css("max-width", contentWidth);
        }


        if(enableClose == true) {
            // Add close events
            $(".infowindow-close").on("click", function() { resetContactForm($('#' + divId)); });
            $(".close-infowindow").on("click", function() { resetContactForm($('#' + divId)); }); 
        }

        $('#' + divId).show();

    }

    var CloseInfoWindow = function () { 

        $("body").removeClass("remove-scroll");
        $("html").removeClass("remove-scroll");		
        
        // Close Window
        $(".infowindow").hide();	
    }
    
    // Taken from DRS, common.js
    /* 
        checkContactEmailInput
        Shows email suggestions on email support form 
        TW June 18 2015 - Added for Email Support Form
    */	
    var checkContactEmailInput = function () {

        var email = $('.es_contact_form_email').val();

        // perform mailcheck
        $('.es_contact_form_email').mailcheck({
            suggested: function(element, suggestion) {
                $('.es_contact_form_email_input_suggestion').html(
                    "Did you mean <span class='es_mailcheck_link'>" + suggestion.full + "</span>?"
                ).show({duration: 400, complete: sizejs.calculateSize});			
            },
            empty: function (element) {
                // If no valid suggestions, hide the "Suggestion" html
                $('.es_contact_form_email_input_suggestion').hide({duration: 100, complete: function() {
                    sizejs.calculateSize();
                }});
            }
        });
    }

    /* 
        resetContactForm
        Resets email support form 
        TW June 18 2015 - Added for Email Support Form
        CR March 03 2016 - Updates for DRS
    */	
    function resetContactForm(parentDiv) {
        // Reset display
        parentDiv.find('.contact-form').show();
        parentDiv.find('.es_contact_form_response').slideUp();
        parentDiv.find('.es_contact_form_error').hide();
        parentDiv.find('.reply-requested').slideUp("fast");

        // Reset error classes
        parentDiv.find('.drs-email-form, .drs-textarea-form, .drs-dropdown-form').removeClass('has-error');

        // Reset values
        parentDiv.find('.es_contact_form_description').find("textarea").val('');
        parentDiv.find('.reply_yn').val('No');
		parentDiv.find('.es_contact_form_missing_reasons').val('');
        parentDiv.find('.es_contact_form_email').val('');


        //Rest help messaging
        parentDiv.find('.drs-help-block').html('');
        parentDiv.find('.es_contact_form_error').hide();
        parentDiv.find('.es_contact_reasons').find('.es_contact_form_error').hide();
        parentDiv.find('.es_contact_form_description').find('.es_contact_form_error').hide();
        parentDiv.find('.reply-requested').find('.es_contact_form_error').hide();

        CloseInfoWindow();
    }

    
    function getPageName() {
        var pageRoute = Backbone.history.getFragment();
        
        if (pageRoute.indexOf('?') !== -1) {
            pageRoute = pageRoute.split('?')[0]
        }
        
        if (_.has(Config.PAGE_NAMES, pageRoute)) {
            return Config.PAGE_NAMES[pageRoute];
        }
        console.debug("Couldn't find a page name for '" + pageRoute + "'");
        return "Initiator Actions - Unknown page";
    }
    
    /* 
        submitContactForm
        Resets email support form 
        TW June 18 2015 - Added for Email Support Form
        CR March 03 2016 - Updates for DRS
    */
    function submitContactForm(parentEle) {
        if(validateVisibleChildElements(parentEle)) {
            
            var reply_email = null;
            if (parentEle.find('.reply_yn').val() === 'Yes') {
                reply_email = parentEle.find('.es_contact_form_email').val();
            }
            
            var dispute_number = $('#dispute_number_sidebar').text(),
                initiator_pin = $('#initiator_pin_sidebar').text();
            
            var support_request_json = {
                dispute_number: dispute_number || '',
                respondent_PIN: initiator_pin || '',
                page: getPageName(),
                contact_reason: parentEle.find('#CR_why').val(),
                description: parentEle.find('.es_contact_form_description textarea').val(),
                email: reply_email || ''
            };
            
            $.salesforce_interface.submit_support_request(JSON.stringify(support_request_json));
        }
    }
    
    /* form-validation.js from DRS */
    
    var HELP_ICON_HTML = "<span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span>";
    var FormUtils = {
        isRequired: function(form_element) {
            var requiredAttr = form_element.attr('data-required');
            return requiredAttr && requiredAttr.toLowerCase() === "true";
        }
    };
    /* TEXTAREA FORM */
    var TextareaForm = {
        MAXIMUM_LENGTH: 40,
        WARNING_OFFSET: 20,
        errorTextTooLong: 'characters too many', 
        containerTag: '.drs-textarea-form'
    };

    TextareaForm.checkTextAreaInput = function (textarea) {

        var content = textarea.val();
        var lengthWarningBlock = textarea.parent().find('.textarea-warning');

        var textarea_form = textarea.closest(TextareaForm.containerTag);

        if (typeof content.length === 'undefined') { content = ""; }

        var newLines = content.match(/\n/g);
        newLines = newLines != null? newLines.length : 0;
        var length = content.length + newLines;     

        var maximum = textarea_form.data('max');

        if (maximum) {
            if (length === 0) {
                lengthWarningBlock.html("Max " + (maximum) + " characters");    

            } else if (length > maximum) {
                lengthWarningBlock.html("Max " + (maximum) + " characters <span class=\"textarea-warning-over\"><b>(" + (length - maximum) + " over</b></span>)");

            } else if (length >= maximum - (maximum/2)) {
               lengthWarningBlock.html("Max " + (maximum) + " characters <span class=\"textarea-warning-under\"><b>(" + (maximum - length) + "</b> left)</span>");

            } else {
                lengthWarningBlock.html("Max " + (maximum) + " characters <span class=\"textarea-warning-under\"><b>(" + (maximum - length) + "</b> left)</span>");         

            }           
        } 

    };
    TextareaForm.validateForm = function (textarea_form) {

        var textarea = textarea_form.find('textarea');
        // trigger another keyup to make sure error messages are up to date
        textarea.trigger('change');
        var value = textarea.val();
        var lbl = textarea_form.find("label:last").text().toLowerCase();
        var maximum = textarea_form.data('max');

        /* CR - Apr 27 2016, fix for DRS-1057*/
        if (FormUtils.isRequired(textarea_form) && (value === '' || value.replace(/\s/g, '') === '')) {
            textarea_form.find('.drs-help-block').html(HELP_ICON_HTML + " Enter the " + lbl + "");
            textarea_form.addClass("has-error")
                    .removeClass("has-warning")
                    .removeClass("has-success");
            return false;
        }
        var newLines = value.match(/\n/g);
        newLines = newLines != null? newLines.length : 0; 
        var length = value.length + newLines;

        if (length > maximum) {

            textarea_form.find('.drs-help-block').html(HELP_ICON_HTML + " You've entered too many characters");
            textarea_form.addClass("has-error")
                    .removeClass("has-warning")
                    .removeClass("has-success");
            return false;
        }

        return true;    
    };
    TextareaForm.initialize = function (textarea_form) {
        textarea_form.data('form-validate', TextareaForm.validateForm);     
        var input = textarea_form.find('textarea');
        var maximum = input.attr('max');
        textarea_form.data('max', maximum);

        input.bind('input propertychange change', function() {
            var self = $(this);
            setTimeout(function() { TextareaForm.checkTextAreaInput(self); }, 100);

            var value = $(this).val();       
            var newLines = value.match(/\n/g);
            newLines = newLines != null? newLines.length : 0; 
            var length = value.length + newLines;

            if (textarea_form.hasClass('has-error') && value !== '') {
                if(typeof maximum === "undefined" || length <= maximum) {
                    textarea_form.removeClass('has-error');
                    textarea_form.find('.drs-help-block').html("");
                }
            }
        });
        // Check right away to get the correct message
        TextareaForm.checkTextAreaInput(input);
    };
    
    /* EMAIL FORM */
    var EmailForm = {
        MAX_LENGTH: 256,
        invalidEmailText: "Enter a valid email",
        emptyEmailText: "Enter an email",
        containerTag: '.drs-email-form'
    };
    EmailForm.isEmailValid = function (email) {
        return email.match(/^[^@]+@[^@]+\.[^@]+$/) && email.length <= EmailForm.MAX_LENGTH;
    };
    EmailForm.checkEmailInput = function (email_input) {
        var email = email_input.val();
        var emailGroup = email_input.closest(EmailForm.containerTag);
        var emailSuggestion = email_input.next('.drs-help-block');

        if (email === '') {
            emailSuggestion.hide(200);
            emailGroup.removeClass('has-success');
            emailGroup.removeClass('has-error');
            return;
        }
        
        emailSuggestion.hide({duration: 200, complete: function() {
            emailGroup.removeClass('has-error');    
            $(this).html(EmailForm.invalidEmailText);
        }});

        //if (!EmailForm.isEmailValid(email)) {
            // If invalid email, disable button, show 'invalid' message, and don't mailcheck
        //    emailSuggestion.html(HELP_ICON_HTML + ' ' + EmailForm.invalidEmailText)
        //        .show({duration: 200});
        //    emailGroup.removeClass('has-success');
        //    return;
        //}
        /*
        $(email_input).mailcheck({
            suggested: function(element, suggestion) {
                emailSuggestion.html(
                    "<span class='drs-mailcheck'>Did you mean <span class='drs-mailcheck-link'>" + suggestion.full + "</span>?</span>"
                ).show({duration: 400});

                // Add click functionality to the mailcheck link
                $('.drs-mailcheck-link').click(function() {
                    //$('.drs-mailcheck-link').parent().prev('.drs-email-input').val($(this).text());
                    email_input.val($(this).text());
                    //emailGroup.addClass('has-success');
                    emailGroup.removeClass('has-error');
                    emailSuggestion.hide({duration: 100, complete: function() {
                        $(this).html(EmailForm.invalidEmailText);
                    }});
                });
                //emailGroup.addClass('has-success');
                emailGroup.removeClass('has-error');
            },
            empty: function (element) {
                // If no valid suggestions, hide the "Suggestion" html
                emailSuggestion.hide({duration: 100, complete: function() {
                    $(this).html(EmailForm.invalidEmailText);
                    emailGroup.removeClass('has-error');
                }});
            }
        });
        */
    };
    EmailForm.validateForm = function (email_form) {
        var emailVal = email_form.find('input').val();
        if (emailVal === '') {
            if (FormUtils.isRequired(email_form)) {
                email_form.find('.drs-help-block').html(HELP_ICON_HTML + ' ' +EmailForm.emptyEmailText).show();
                return false;
            }
            return true;
        }
        if (EmailForm.isEmailValid(emailVal)) {
            return true;  
        } else {
            email_form.find('.drs-help-block').html(HELP_ICON_HTML + ' ' +EmailForm.invalidEmailText).show();
            return false;
        }
    };
    EmailForm.initialize = function (email_form) {

        email_form.data('form-validate', EmailForm.validateForm)
            // Set initial error message
            .find('.drs-help-block').html(HELP_ICON_HTML + ' ' +EmailForm.invalidEmailText).hide();

        // Set up button handlers to track delay 
        email_form.find('input').on('keyup.drs-email', function() {
            var self = $(this);
            setTimeout(function() {EmailForm.checkEmailInput(self);}, 200);
        });

        email_form.find('input').on('blur.drs', function () {
            var value = $(this).val();
            if (email_form.hasClass('has-error') && value !== '') {
                email_form.removeClass('has-error');
                email_form.find('.drs-help-block').html('');
            }
        });


    };
    EmailForm.initializeAll = function () {
        $(EmailForm.containerTag).each(function() {
            EmailForm.initialize($(this));
        });
    };

	/* GENERAL DROPDOWN FIELD FORM */
	var DropdownForm = {
		containerTag: '.drs-dropdown-form',
		validateForm: function (dropdown_form) {
			var value = dropdown_form.find('select').val();
			if (FormUtils.isRequired(dropdown_form) && value === '') {
				dropdown_form.find('.drs-help-block').html(HELP_ICON_HTML + ' Select an option');
				return false;
			}
			dropdown_form.find('.drs-help-block').html('');
			return true;
		}
	};
	DropdownForm.initialize = function (dropdown_form) {
		dropdown_form.data('form-validate', DropdownForm.validateForm);
		var input = dropdown_form.find('select');
		input.on('blur.drs', function () {
			var value = $(this).val();
			if (dropdown_form.hasClass('has-error') && value !== '') {
				dropdown_form.removeClass('has-error');
				dropdown_form.find('.drs-help-block').html('');
			}
		});
	};
	DropdownForm.initializeAll = function () {
		$(DropdownForm.containerTag).each(function () {
			DropdownForm.initialize($(this));
		});
	};
	
	
	
    
    function setFormColorState(form, state) {
        if (form.hasClass('drs-form')) {
            return;
        }
        if (state) {
            // don't show green form.addClass('has-success');
            form.removeClass('has-error');
        } else {
            form.addClass('has-error');
            form.find(".form-control-feedback").removeClass("hidden");
            // don't show green form.removeClass('has-success');
        }
        form.removeClass('has-warning');
    }
    
    var allFormTypes = [
        EmailForm, TextareaForm, DropdownForm
    ];

    function initializeAllForms(parentEle) {
        parentEle = (parentEle && parentEle.length > 0)? $(parentEle[0]) : $('html');
        allFormTypes.forEach(function (formType) {
            parentEle.find(formType.containerTag).each(function() {
                formType.initialize($(this));
            });
        });
    }
    
    function getAllFormElements(parentEle, visibleOnly) {
        var allFormClassesSearchString = allFormTypes.map(function(formType) {
            return formType.containerTag + ((visibleOnly)? ':visible' : '');
        }).join(',');
        return parentEle.find(allFormClassesSearchString);
    }

    function validateElements(form_elements) {
        var allFormsValid = true;
        // Only show validate visible fields within the form
        var elementValidationResult = true;

        $.each(form_elements, function() {
            var validationFunction = $(this).data('form-validate');
            if (validationFunction) {
                elementValidationResult = validationFunction($(this));
                if (!elementValidationResult) {
                    allFormsValid = false;           
                }
                setFormColorState($(this), elementValidationResult);
            }
        });

        return allFormsValid;
    }

    // Validates visible children of the form - all levels deep
    function validateVisibleChildElements(parentEle) {
        return validateElements(
            getAllFormElements(parentEle, true));
    }
    
    function initializeAllForms(parentEle) {
        parentEle = (parentEle && parentEle.length > 0)? $(parentEle[0]) : $('html');
        allFormTypes.forEach(function (formType) {
            parentEle.find(formType.containerTag).each(function() {
                formType.initialize($(this));
            });
        });
    }
    
    var Utilities =  {
        getParameterByName: function(name) {
            var url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        },
        
        show_loading: function() {
            $('#loading_dialog').modal('show');
        },
        hide_loading: function() {
            $('#loading_dialog').modal('hide');
        },
        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        
        // External objects from DRS feedback
        DRS: {
            CustomConfirm: function(title, text, primaryButtonText, primaryActionOnClickFunction, primaryActionOnClickParams, secondaryButtonText, disablePrimaryOnLoad, primaryButtonHasIcon) { CustomConfirm(title, text, primaryButtonText, primaryActionOnClickFunction, primaryActionOnClickParams, secondaryButtonText, disablePrimaryOnLoad, primaryButtonHasIcon); },
            CloseFeedbackWindow: function() { CloseFeedbackWindow(); },
            
            OpenInfoWindow: function(divId, title, contentWidth, enableClose, useAbsolute) { OpenInfoWindow(divId, title, contentWidth, enableClose, useAbsolute); },
            CloseInfoWindow: function() { CloseInfoWindow(); },
            
            resetContactForm: function(parentEle) { resetContactForm(parentEle); },
            submitContactForm: function(parentEle) { submitContactForm(parentEle); },
            
            initializeAllForms: function(parentEle) { initializeAllForms(parentEle); },
            validateVisibleChildElements: function(parentEle) { return validateVisibleChildElements(parentEle); }
        },
        onSubmitContactFormSuccess: function() {
            // send based on type of form
            var parentEle = $('#infoWindowHelp');
            parentEle.find('.contact-form').hide();
            parentEle.find('.es_contact_form_response').slideDown("fast");
        },
        onSubmitContactFormError: function() {
            //console.debug("ERROR SENDING SUPPORT REQUEST");
        }
    };
    return Utilities;
});