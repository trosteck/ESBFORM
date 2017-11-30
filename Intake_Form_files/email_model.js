define(["jquery", "underscore", "backbone"],
       function($, _, Backbone) {

	var EmailModel = Backbone.Model.extend({

        defaults: {
			email_address: null,
			reason_not_using_email: null,
			show_unable_to_use: false,
			required: true
        }
    });
	
    return EmailModel;
});



