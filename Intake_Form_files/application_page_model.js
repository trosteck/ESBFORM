define(["jquery", "underscore", "backbone", "constants", "formbuilder", 'models/formal_communication_model','models/email_model','models/phone_list_model','models/phone_model','models/fax_model','models/address_model','models/person_extra_considerations_model'],
       function($, _, Backbone, Constants, FormBuilder, FormalCommunicationModel, EmailModel,PhoneListModel,PhoneModel,FaxModel,AddressModel,PersonExtraConsiderationsModel
) {

    var ApplicationPageModel = Backbone.Model.extend({
		
        defaults: {
			person_first_name: null,
			person_last_name: null,
            other_names: null,
            
            birth_date: null,
            number_of_children: null,
            name_of_other_parent: null,
            
			address_model: new AddressModel(),
			
            formal_communication_model: new FormalCommunicationModel(),
			email_model: new EmailModel({ show_unable_to_use: false }),
            phone_list_model: new PhoneListModel({ index_number: 1 }),
            
            person_extra_considerations_model: new PersonExtraConsiderationsModel(),
            additional_information: null,
            
            pageComplete: false,
            parent: null,
            
            es_exploration_data: null
        },
        
        getData: function() {
            var return_obj = {};
            
            return_obj.person_first_name = this.get('person_first_name');
            return_obj.person_last_name = this.get('person_last_name');
            return_obj.other_names = this.get('other_names');
            
            return_obj.birth_date = this.get('birth_date');
            return_obj.number_of_children = this.get('number_of_children');
            return_obj.name_of_other_parent = this.get('name_of_other_parent');
            
            return_obj.additional_information = this.get('additional_information');
            
            return_obj.email_address = this.get('email_model').get('email_address');
            return_obj.contact_us = this.get('formal_communication_model').get('formal_communication');
            
            _.each(this.get('address_model').toJSON(), function(val, key) {
                return_obj[key] = val;
            });
            
            _.each(this.get('person_extra_considerations_model').toJSON(), function(val, key) {
                return_obj[key] = ( val === "true" ) ? 'Yes' :
                        ( val === "false" ? null : val);
            });
            
            return_obj.special_accomodations = return_obj.special_accomodations ? return_obj.special_accomodations.join('<br/>') : null;
            
            return_obj.phones = [];
            _.each(this.get('phone_list_model').get('phoneModels'), function(phoneModel) {
                console.log(phoneModel, phoneModel.toJSON());
                
                return_obj.phones.push({
                    phone_number: phoneModel.get('phone_number'),
                    phone_extension: phoneModel.get('phone_extension')
                });
            });
            
            // This field is used for phone display
            return_obj.phone_numbers = !_.isEmpty(return_obj.phones) ? _.map( return_obj.phones, function(phone) {
                    return FormBuilder.toPhoneDisplay(phone.phone_number) +
                            (phone.phone_extension ? ' '+phone.phone_extension : '');
                } ).join('<br/>') : null;
            
            return return_obj;
            
        }
    });

    return ApplicationPageModel;
});
