define(["jquery", "underscore", "backbone"],
       function($, _, Backbone) {

	var PhoneModel = Backbone.Model.extend({

        defaults: {
            is_first: true,
			phone_number: null,
            phone_extension: null,
			required: true,
			show_remove: false
        }
    });
	
    return PhoneModel;
});



