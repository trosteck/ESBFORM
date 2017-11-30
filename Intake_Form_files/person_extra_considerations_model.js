define(["jquery", "underscore", "backbone", "constants"],
       function($, _, Backbone, Constants) {

	var PersonExtraConsiderationsModel = Backbone.Model.extend({
        defaults: {
			special_accomodations: null,
			special_accomodation_other_text: null,
			is_under_19: Constants.NO_YES_OPTIONS[0].val
        },
        
        initialize: function() {
        }
    });
	
    return PersonExtraConsiderationsModel;
});



