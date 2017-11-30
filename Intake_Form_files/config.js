define(['jquery'], function($) {
    return {
        MAXLENGTHS: {
			dispute_number: 13,
			respondent_pin: 5, //Respondent PIN	Respondent_PIN__c	respondent_pin	Text(5)
			
			address_line_1: 250, //Address Line 1	Address_Line_1__c	address_line_1	Text(250)
			address_line_2: 250, //Address Line 2	Address_Line_2__c	address_line_2	Text(250)
			address_city: 100, //City	City__c	city	Text(100)
			address_country_text: 100, // Other Country	Other_Country__c	other_country	Text(100)
			address_province_text: 100, //Other Region	Other_Region__c	other_region	Text(255)
			postal_code: 10, //Postal Code	Postal_Code__c	postal_code	Text(10)
			
			first_name: 40, //First Name	First_Name__c	first_name	Text(40)
			last_name: 40, //Last Name	Last_Name__c	last_name	Text(40)
			other_names: 500, //Other Name	Other_Name__c	other_name	Long Text Area(500) OR? Other Names	Other_Names__c	other_names	Long Text Area(10000)
			
			business_name: 250, // Business Name / Strata Plan Number	Business_Name__c	business_name	Text(250)
			business_number: 9, //Business Number	Business_Number__c	business_number	Text(9)
			business_type_other: 250, //Business Type Specify	Business_Type_Specify__c	business_type_specify	Text(250)
			
			
			strata_name: 20, //?
			strata_section: 20, //Strata section number 	Strata_section_number__c	strata_section_number	Text(20)
			
			contact_title: 250, //Title	Title__c	title	Text(255)
			
			email: 250,
			email_not_using_reason: 400, //Why not email?	Why_not_email__c	why_not_email	Long Text Area(500)
			
			special_accomodation_other: 200, //SA: Other Difficulties	SA_Other_Difficulties__c	sa_other_difficulties	Text(100)
			
			representative_reason: 500, //Reason for Representative	Reason_for_Representative__c	reason_for_representative	Long Text Area(500)
			representative_relationship: 100, //Relationship To Applicant	Relationship_To_Applicant__c	relationship_to_applicant	Text(100)
			
			phone_number: 80, //This seems way to long...
			phone_extension: 10, //Phone 1 Ext	Ext_1__c	ext_1	Text(10)
			
			extension_request_description: 1000, //Response Extension Reason	Response_Extension_Reason_c	response_extension_reason	Text(250)
			
			//These are all claim related
			claim_description: 5000, //Description of the issue	Description__c	description	Long Text Area(5000)
			claim_when_aware: 1000, // When were you aware?	When__c	when	Long Text Area(2000)			
			claim_done_so_far: 1000, // What have you done so far?	Previous_Activities__c	previous_activities	Long Text Area(2000)
			claim_why_important: 1000, //Why is this important?	Importance__c	importance	Long Text Area(2000)
			claim_willing_to_do: 1000, // ??
			claim_outcome_disagree_reason: 200, // Outcome, remedy or action	Remedy__c		Text(200)
			
			//Additional info
			other_claim_started_description: 1000, //??
			
			
        },
        
        PAGE_NAMES: {
        }
    };
});






