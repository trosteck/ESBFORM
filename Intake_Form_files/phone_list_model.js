define(["jquery", "underscore", 'models/phone_model', "backbone"],
       function($, _, PhoneModel, Backbone) {

	var PhoneListModel = Backbone.Model.extend({

        defaults: {
			phoneModels: [new PhoneModel({index_number: 1})] ,
        },
        
        initialize: function() {
            // Always create phone list with one phone number
            //this.set('phoneModels', [new PhoneModel({index_number: 1})] );
        }
    });
	
    return PhoneListModel;
});



