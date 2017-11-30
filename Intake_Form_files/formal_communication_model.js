define(["jquery", "underscore", "backbone", "constants"],
       function($, _, Backbone, Constants) {

	var FormalCommunicationModel = Backbone.Model.extend({

        defaults: {
			formal_communication: Constants.FORMAL_COMMUNICATION_OPTIONS[0].val,
			preference_for: 'applicant' // applicant or representative
        }
    });
	
    return FormalCommunicationModel;
});



