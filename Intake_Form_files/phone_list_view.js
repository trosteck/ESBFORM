define(["jquery", "underscore", "backbone", "utilities", "formbuilder", "router", "moment", "backbone-forms", 
		'text!templatePath/phone_list_template.html',
		'views/phone_view', 
		'models/phone_model', 
		'loader'],
       function($, _, Backbone, Utilities, FormBuilder, Router, Moment, BackboneForms, 
				 ComponentPhoneListTemplate,
				 ComponentPhoneView, 
				 PhoneModel,
				 PageLoader) {
    
    var PhoneListView = Backbone.View.extend({
		
		
        init_state: function() {
			_.each(this.phoneViews, function(phoneView) {
                phoneView.delegateEvents();
            });
        },
        
        render: function() {
            var that = this;
			
            this.form = new BackboneForms({
				template: _.template(ComponentPhoneListTemplate),
                model: this.model,
                templateData: {
                    phoneModels: this.model.get('phoneModels')
                },
                schema: {	
				}
            }).render();
			
			
			_.each(this.phoneViews, function(phoneView) {
                phoneView.destroyView();
            });
            this.phoneViews = [];
            
            var i = 0;
            _.each(this.model.get('phoneModels'), function(phoneModel) {
                phoneModel.set('is_first', (i === 0));
                var phoneView = new ComponentPhoneView({ model: phoneModel });
                that.phoneViews.push(phoneView);
                i++;
            });
            
            this.$el.html(this.form.el);
            this.checkAndDisableAddPhone();
			
            _.each(this.phoneViews, function(phoneView) {
                that.$('#phone-item-form').append(phoneView.render().el);
				that.setupListeners(phoneView);
            });
			
			
            this.form.delegateEvents();
            
            this.$('[data-toggle="tooltip"]').tooltip();
            
            return this;
        },
		
        checkAndDisableAddPhone: function() {
            var phoneModels = this.model.get('phoneModels') || [];
            if (phoneModels.length >= 5) {
                this.$('.add-phone-container').addClass('hidden');
            } else {
                this.$('.add-phone-container').removeClass('hidden');
            }
        },
            
        setupListeners: function(phoneView) {
			var that = this;
			that.stopListening(phoneView.model, 'removePhone', this.removePhone);
			that.listenTo(phoneView.model, 'removePhone', this.removePhone);
        },
        
		events: {
			'click .add-phone': 'addPhone'
        },		
		
		addPhone: function(event) {
			var that = this;

			event.preventDefault();
            
            var newModel = new PhoneModel({ required: false, show_remove: true, is_first: false});
			this.model.get('phoneModels').push(newModel);

			var newPhoneView = new ComponentPhoneView({ model: newModel });
			this.phoneViews.push(newPhoneView);

			this.$('#phone-item-form').append(newPhoneView.render().el);
			that.setupListeners(newPhoneView);
			
            this.checkAndDisableAddPhone();
			return false;
		},
        
		removePhone: function(model) {
			var modelIndex = -1,
                viewIndex = -1,
                phoneModels = this.model.get('phoneModels');
            
            _.each(phoneModels, function(phoneModel, index) {
				if(phoneModel === model) {
					modelIndex = index;
				}
            });
			if(modelIndex !== -1) {
				phoneModels.splice(modelIndex, 1);
			}
            
			_.each(this.phoneViews, function(phoneView, index) {
				if(phoneView.model === model) {
                    phoneView.destroyView();
					viewIndex = index;
				}
            });
			if(viewIndex !== -1) {
				this.phoneViews.splice(viewIndex, 1);
			}
			
			this.checkAndDisableAddPhone();
        },
        
        setToRequired: function() {
            this.setIsRequired(true);
        },
        setToOptional: function() {
            this.setIsRequired(false);
        },
        setIsRequired: function(isRequired) {
            if (this.phoneViews && this.phoneViews.length > 0) {
                this.phoneViews[0].model.set('required', isRequired);
            }
            console.log(this);
        }
    });

   return PhoneListView;

});
