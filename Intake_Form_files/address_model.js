define(["jquery", "underscore", "backbone", "constants"],
       function($, _, Backbone, Constants) {

	var AddressModel = Backbone.Model.extend({
		
        defaults: {
			address_line_1: null,
            address_line_2: null,
			city: null,
			country: Constants.COUNTRY_OPTIONS[0].val,
			other_country: null,
			province: Constants.CANADA_PROVINCES[1],
			other_region: null,
			state: null,
			postal_code: null
        }
    });
	
    return AddressModel;
});