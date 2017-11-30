define(["jquery",
		"underscore",
		"backbone",
		"constants",
		"formbuilder",
		"utilities",
		"config",
		"router",
		"moment",
		"Modernizr",
		"backbone-forms",
		'views/page_view',
		'text!templatePath/applicant_page_template.html',
		'text!templatePath/applicant_page_form_template.html',
		'text!templatePath/application_exploration_data_template.html',
		'views/contact_us_communication_view',
		'views/email_view',
		'views/phone_list_view',
		'views/fax_view',
		'views/address_view',
		'views/person_extra_considerations_view',
		'loader'
], function($,
		_,
		Backbone,
		Constants,
		FormBuilder,
		Utilities,
		Config,
		Router,
		Moment,
		Modernizr,
		BackboneForms,
		PageView,
		ApplicantPageTemplate,
		ApplicantPageFormTemplate,
		ApplicationDataTemplate,
		ContactUsCommunicationView,
		EmailView,
		PhoneListView,
		FaxView,
		AddressView,
		PersonExtraConsiderationsView,
		PageLoader
) {

    var ApplicantPageView = PageView.extend({
        template: _.template(ApplicantPageTemplate),
        explorationDataTemplate: _.template(ApplicationDataTemplate),
        typeRegex: { date: /^\d{4}-\d{1,2}-\d{1,2}$/, numChildren: /(^[0-9]$)|(^[1-9]\d$)/ },

        SOLUTION_EXPLORER_INTERNAL_ERROR: 'Something went wrong getting exploration data.',

		init_state: function() {

		},

        initialize: function() {
            PageView.prototype.initialize.call(this);
            this.addressView = new AddressView({ model: this.model.get('address_model') });
            this.phoneListView = new PhoneListView({ model: this.model.get('phone_list_model') });
            this.emailView = new EmailView({ model: this.model.get('email_model') });
            this.contactUsCommunicationView = new ContactUsCommunicationView({ model: this.model.get('formal_communication_model') });

            this.personExtraConsiderationsView = new PersonExtraConsiderationsView({ model: this.model.get('person_extra_considerations_model') });

            this.listenTo(this.model, 'change:es_exploration_data', this.renderExploreData);

            // In firefox touch events is always true (known issue), so checking if it's firefox
			this.useTouchInput = false;
			var isFireFox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
			if (!isFireFox && Modernizr.touchevents) {
				this.useTouchInput = true;
			}
        },


        renderExploreData: function() {
            this.$('#es-exploration-data-container').append(this.explorationDataTemplate(this.model.toJSON()));
            return this;
        },

        render: function() {
            Utilities.show_loading();
			this.model.set('pageComplete', false);

			var respondentSubType = this.model.get('parent').get('owner_or_tenant');
            this.form = new BackboneForms({
                template: _.template(ApplicantPageFormTemplate),
                model: this.model,
                templateData: {
                    maxRequestDescriptionCharacters: Config.MAXLENGTHS.extension_request_description
                },
                schema: {
					person_first_name: {
						type: 'Text',
						editorAttrs: {id: 'updated-first-name', maxlength: Config.MAXLENGTHS.first_name },
						editorClass: 'form-control input-max-width400 ',
						validators: ['required']
					},

                    person_last_name: {
						type: 'Text',
						editorAttrs: {id: 'updated-last-name', maxlength: Config.MAXLENGTHS.last_name },
						editorClass: 'form-control input-max-width400 ',
						validators: ['required']
					},
					other_names: {
						type: 'TextArea',
						editorAttrs: {id: 'ext-description', rows: '2', maxlength: Config.MAXLENGTHS.other_names },
						editorClass: 'form-control'
					},
                    birth_date: {
						type: 'Text',
						editorAttrs: {id: 'birth-date' },
						editorClass: 'form-control input-max-width250',
						validators: [this.typeRegex.date]
					},

                    number_of_children: {
						type: 'Text',
						editorAttrs: {id: 'number-of-children', maxlength: Config.MAXLENGTHS.respondent_pin, 'data-toggle': 'tooltip', 'data-placement': 'top', title: 'Numbers only', 'data-trigger': 'manual'},
						editorClass: 'form-control numbersOnly input-max-width100 ',
						validators: ['required', this.typeRegex.numChildren]
					},

                    name_of_other_parent: {
						type: 'Text',
						editorAttrs: {id: 'other-parent-full-name', maxlength: Config.MAXLENGTHS.first_name + Config.MAXLENGTHS.last_name },
						editorClass: 'form-control input-max-width400 ',
						validators: ['required']
					},

                    additional_information: {
						type: 'TextArea',
						editorAttrs: {id: 'additional-information', rows: '5', maxlength: Config.MAXLENGTHS.extension_request_description },
						editorClass: 'form-control',
						validators: []
					},
				}
            }).render();

            FormBuilder.clientSideClearSetup(this.form);
			FormBuilder.removeEnterKeySubmit(this.form);

            this.form.on('additional_information:change', function(form, editor) {
                var ele = editor.$el,
                    content = ele.val();
                // Newlines are seen as two characters by textarea's "maxlength", so factor that into textarea length
                var newLines = content.match(/\n/g);
                newLines = newLines !== null ? newLines.length : 0;
                var content_length = content.length + newLines;

                var countdown_ele = ele.closest('.form-group').find('.countdown-block');
                countdown_ele.find('.countdown').html('(' +
                    Math.max(Config.MAXLENGTHS.extension_request_description - content_length, 0) + ' left)');
            });


            this.$el.html(this.template(this.model.toJSON()));
            this.renderExploreData();

			this.$('#applicant-page-form').append(this.form.el);

			/* If touch device with HTML5 use native date field */
			// && Modernizr.inputtypes.date
			if (this.useTouchInput) {
				this.form.$('#birth-date').removeAttr("type");
				this.form.$('#birth-date').attr("type", "Date");
			} else {
				this.form.$('#birth-date').datepicker({
					dateFormat: 'yy-mm-dd',
					onSelect: function() {
						$(this).trigger('blur');
					}
				});

				/* Make calendars clickable */
				this.form.$('.input-group-addon > .glyphicon-calendar').parent().click(function() {
					$(this).closest('.input-group').find('input').datepicker("show");
				});
			}

			/* If touch device with HTML5 need to apply additional formatting to field */
			//&& Modernizr.inputtypes.date
			if (this.useTouchInput) {
				this.$('#birth-date').addClass("mobile-date-picker");
				this.$("#date-input-group").removeClass("input-group");
				this.$("#cal-icon").removeClass("input-group-addon").addClass("hidden");
			}

			this.assign({
				'#person-mail-address': this.addressView ,
				'#person-phone-list-form': this.phoneListView,
				'#contact-us-communication-email-form': this.emailView,
				'#contact-us-communication-form': this.contactUsCommunicationView,
				'#person-extra-considerations-form': this.personExtraConsiderationsView
			});

            this.setupListeners();

            // Do an initial toggle of contact us options
            this.toggleContactUs(this.contactUsCommunicationView);
            this.$('[data-toggle="tooltip"]').tooltip();

            this.loadAndRenderExplorationData();
            return this;
        },

        // This function is always called on page load, and always stops Page Loader
        loadAndRenderExplorationData: function() {
            var accessCode = Utilities.getParameterByName('accessCode') || null,
                that = this;

            if (!accessCode) {
                Utilities.hide_loading();
                return;
            }

            $.ajax({
                url: 'sf.php',
                type: 'POST',
                data: {
                    action: 'get_data',
                    accessCode: accessCode
                },
                dataType: "json"
            }).then(function(data) {

                // When invalid code is found
                if (data && !_.isEmpty(data) && _.has(data, 'errorCode') && data.errorCode) {
                    this.displayFormSubmissionError(this.SOLUTION_EXPLORER_INTERNAL_ERROR);
                } else {
                    that.model.set('es_exploration_data', data);
                }

                Utilities.hide_loading();
            }, function(errorResponse, errorMsg) {
                // TODO: Show error message?
                console.debug(errorResponse);
                errorMsg = errorMsg || this.SOLUTION_EXPLORER_INTERNAL_ERROR;
                that.showSolutionExplorerPageError(errorMsg);
                Utilities.hide_loading();
            });
        },

        showSolutionExplorerPageError: function(errorMsg) {
            this.displayFormSubmissionError(errorMsg);
        },

        setupListeners: function() {
            if (this.contactUsCommunicationView) {
                this.stopListening(this.contactUsCommunicationView.form, 'formal_communication:change',
                        this.toggleContactUs);
                this.listenTo(this.contactUsCommunicationView.form, 'formal_communication:change', this.toggleContactUs);
            }
        },


        /* to do, can this go somewhere more global */
		keyUpNumberOnly: function(e) {

			var ele = $(e.currentTarget);
			var code = ele.val();

			if (code.match(/[^\d]/)) {
				if(!ele.data()['bs.tooltip'].tip().hasClass('in')) {
					ele.tooltip('show');
    			}
				/* To do - find the field directly */
				_.each(this.form.fields, function(data, model_key) {
					//console.debug('data' + data);
					//console.debug('modelkey: ' + model_key);
					if(model_key == 'number_of_children') {
						data.editor.setValue(code.replace(/[^0-9]/g,''));
					}
				});
			}
			else {
				ele.tooltip('hide');
			}
		},

        toggleContactUs: function(contactUsCommunicationForm) {
            var checked_method = contactUsCommunicationForm.$('*:checked'),
                selected_val = checked_method.val();

            var firstPhoneView = (this.phoneListView && this.phoneListView.phoneViews.length > 0) ? this.phoneListView.phoneViews[0] : null;

            if (selected_val === 'Email') {
                this.emailView.model.set('required', true);
                if (firstPhoneView)
                    firstPhoneView.model.set('required', false);
            } else if (selected_val === 'Phone') {
                this.emailView.model.set('required', false);
                if (firstPhoneView)
                    firstPhoneView.model.set('required', true);
            } else if (selected_val === 'Pickup') {
                this.emailView.model.set('required', false);
                if (firstPhoneView)
                    firstPhoneView.model.set('required', false);

                /* TODO: Show some popup warning or info message? */
            } else {
                console.debug('No valid selection');
                return;
            }

            this.emailView.model.set('email_address', this.emailView.$('input').val());
            this.emailView.render();
        },

        events: function() {

            return _.extend({}, PageView.prototype.events, {
                'click .tribunal-brand-logo a': function() { return false; },
                'keyup :input.numbersOnly': 'keyUpNumberOnly',

                'click .form-submit': function(event) {

					this.clearPageErrors();
                    event.preventDefault();

                   if (this.validatePage()) {
						PageLoader.start($('body'));
						this.commitPage(); // Push changes to the model
						this.model.set('pageComplete', true);
					    Router.getInstance().navigate('application-receipt', { trigger: true });
					}

                    return false;
                }
            });
        },




        validatePage: function() {
            var all_errors = {},
                that = this;

			_.extend(all_errors, this.validateFormAndDisplayErrors(this.form));
			_.extend(all_errors, that.validateFormAndDisplayErrors(this.addressView.form));

			_.each(this.phoneListView.phoneViews, function(phoneView) {
                _.extend(all_errors, that.validateFormAndDisplayErrors(phoneView.form));
            });
			_.extend(all_errors, that.validateFormAndDisplayErrors(this.emailView.form));
            _.extend(all_errors, that.validateFormAndDisplayErrors(this.contactUsCommunicationView.form));
			_.extend(all_errors, that.validateFormAndDisplayErrors(this.personExtraConsiderationsView.form));

            if (_.isEmpty(all_errors)) {
                return true;
            } else {
                this.scrollToFirstErrorMessage();
            	//$("#dispute-notice-review-form input:text, #person-change-mail-address input:text, #person-other-names-form textarea, #person-phone-list-form input:text, #person-fax-form input:text, #formal-communication-form input:text, #informal-communication-form input:text, #informal-communication-email-form input:text, #person-extra-considerations-form input:text").first().focus();
				//console.debug($("#dispute-notice-review-form input:text, #person-change-mail-address input:text, #person-other-names-form textarea, #person-phone-list-form input:text, #person-fax-form input:text, #formal-communication-form input:text, #informal-communication-form input:text, #informal-communication-email-form input:text, #person-extra-considerations-form input:text").first());
				return false;
            }
        },

        commitPage: function() {
            var that = this;

			this.model.set(this.getFormToCommit(this.form));
			this.model.get('address_model').set(this.getFormToCommit(this.addressView.form));

			_.each(this.phoneListView.phoneViews, function(phoneView, phoneModel) {
				that.model.get('phone_list_model').get('phoneModels')[phoneModel].set(that.getFormToCommit(phoneView.form));
            });

			this.model.get('email_model').set(this.getFormToCommit(this.emailView.form));			this.model.get('formal_communication_model').set(this.getFormToCommit(this.contactUsCommunicationView.form)); this.model.get('person_extra_considerations_model').set(this.getFormToCommit(this.personExtraConsiderationsView.form));
        },

    });

   return ApplicantPageView;

});
