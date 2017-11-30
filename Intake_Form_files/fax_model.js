define(["jquery", "underscore", "backbone"],
       function($, _, Backbone) {

	var FaxModel = Backbone.Model.extend({

        defaults: {
			fax_number: null,
            required: false
        }
    });
	
    return FaxModel;
});
