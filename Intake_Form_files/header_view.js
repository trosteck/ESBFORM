define(["jquery", "underscore", "backbone", "utilities", 'text!templatePath/header_template.html'], function($, _, Backbone, Utilities, HeaderTemplate) {

    var HeaderView = Backbone.View.extend({
        template: HeaderTemplate,

        events: {
            'click .mobile-menu-container' : 'showMenu',
        },

        initialize: function() {
            $.salesforce_interface.form_triggers.submit_support_request_success = Utilities.onSubmitContactFormSuccess;
            $.salesforce_interface.form_triggers.submit_support_request_error = Utilities.onSubmitContactFormError;
        },
        
        render: function() {
            this.$el.html(this.template);
            this.initializeContactForm();
            return this;
        },

        initializeContactForm: function() {
            var somethingBrokenInfowindowId = 'infoWindowHelp',
                that = this;
            
            this.$('.help-link').click(function () {
                Utilities.DRS.OpenInfoWindow('infoWindowHelp', 'Contact us');
                Utilities.DRS.initializeAllForms($('#' + somethingBrokenInfowindowId));
            });
            $("body").on("click", ".es_cancel_contact_form", function (){
                Utilities.DRS.resetContactForm($('#' + somethingBrokenInfowindowId));
            });	
            $("body").on("click", ".es_submit_contact_form", function (){
                Utilities.DRS.submitContactForm($('#' + somethingBrokenInfowindowId));
            });	
            $("body").on("change", ".reply_yn", function (){
                var str = "";
                that.$( "select option:selected" ).each(function() {
                  str = $( this ).text();
                });
                if(str == "Yes") {
                    $('.reply-requested').slideDown("fast");
                } else {
                    $('.reply-requested').slideUp("fast");
                }
            });
        },
            
        showMenu: function(e) {
            var mobileMenuContainer = this.$('.mobile-menu-container');
            if($(e.currentTarget).is(':visible')) {
                this.trigger('show_menu');
                if(mobileMenuContainer.hasClass('menu-open')) {
                    mobileMenuContainer.removeClass('menu-open');
                } else {
                    mobileMenuContainer.addClass('menu-open');
                }
            }
            return false;
        }
    });

    return HeaderView;
});
