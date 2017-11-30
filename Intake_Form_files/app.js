define(["jquery", "underscore", "backbone", "router", "backbone-forms", 'models/main_model'],
       function($, _, Backbone, Router, BackboneForms, MainModel) {

    var initialize = function() {
        // Add a generic cleanup method for a View
        Backbone.View.prototype.destroyView = function() {
            // Recursively remove any child views
            if (this.childViews) {
                _.each(this.childViews, function(view) {
                    view.destroyView();
                });
                this.childViews = [];
            }
            // Completely unbind the view
            this.undelegateEvents();
            this.$el.removeData().unbind();

            // Remove view from DOM
            this.remove();
            Backbone.View.prototype.remove.call(this);
        };
        
        // Overwrite BackboneForm defaults
        BackboneForms.validators.errMessages.required = "Enter the ";
        BackboneForms.validators.errMessages.regexp = "Enter a valid ";
        
        
        // Start the router
        Router.initialize(new MainModel());
    };

    return {
        initialize: initialize
    };
});
