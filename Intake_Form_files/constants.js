define(['jquery'], function($) {
    return {
		
		COUNTRY_OPTIONS : [
			{ label: "Canada", val: "Canada"},
			{ label: "US", val: "US"},
			{ label: "Other", val: "Other"},
		],
	
		
        CANADA_PROVINCES: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec","Saskatchewan", "Yukon"],
        
        US_STATES: [ "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming" ],
			
		EXTENSION_CONSENT_OPTIONS : [
				{ labelHTML: "I certify that I am the respondent or I am authorized to file this Dispute Response for the respondent", val: 1},
				{ labelHTML: "I understand that, under section 92 of the Civil Resolution Tribunal Act, a person who provides false or misleading evidence or other information in a tribunal proceeding commits an offence and is liable on conviction to a fine of $10,000 or imprisonment for term not longer than 6 months, or both", val: 2}
			],
			
		
		
		
		IS_PERSON_PARTY_TYPE_CORRECT_OPTIONS : [
				{ label: "I am shown correctly as a person", val: "true"},
				{ label: "I should be shown as a business or organization", val: "business or organization"},
				{ label: "I should be shown as a strata corporation or strata section", val: "strata"}
			],

			 IS_PERSON_NAME_CORRECT_OPTIONS : [
				{ label: "Yes, my name is shown correctly", val: "true"},
				{ label: "No, I need to update my name", val: "false"},
			],
			
			 IS_PERSON_ADDRESS_CORRECT_OPTIONS : [
				{ label: "Yes, my mailing address is shown correctly", val: "true"},
				{ label: "No, I need to update my mailing address ", val: "false"},
			],
			
			IS_TENANT_CORRECT_OPTIONS  : [
				{ label: "Yes, I am a tenant", val: "true"},
				{ label: "No, I should be shown as an owner", val: "false"}
			],	
		
			IS_OWNER_CORRECT_OPTIONS : [
					{ label: "Yes, I am an owner", val: "true"},
					{ label: "No, I should be shown as an tenant", val: "false"}
				],
		
		
			IS_BUSINESS_PARTY_TYPE_CORRECT_OPTIONS  : [
				{ label: "This respondent is shown correctly as a business or organization", val: "true"},
				{ label: "This respondent should be shown as a person", val: "false-should-be-person"},
				{ label: "This respondent should be shown as a strata corporation or strata section", val: "false-should-be-strata"}
			],
			
			IS_BUSINESS_NAME_CORRECT_OPTIONS : [
				{ label: "Yes, my business or organization's legal name is shown correctly", val: "true"},
				{ label: "No, I need to update my business or organization's legal name", val: "false"},
			],
			
			
			IS_BUSINESS_TYPE_CORRECT_OPTIONS : [
				{ label: "Yes, my business type is shown correctly for my business or organization", val: "true"},
				{ label: "I need to update the business type for my business or organization", val: "false"},
			],

			IS_BUSINESS_ADDRESS_CORRECT_OPTIONS : [
				{ label: "Yes, the mailing address is shown correctly for my business or organization", val: "true"},
				{ label: "No, I need to update the mailing address for my business or organization", val: "false"},
			],
		
		
			 IS_STRATA_PARTY_TYPE_CORRECT_OPTIONS : [
				{ label: "This respondent is shown correctly as a strata corporation or strata section", val: "true"},
				{ label: "This respondent should be shown as a person", val: "false-should-be-person"},
				{ label: "This respondent should be shown as a business or organization", val: "false-should-be-business"}
			],

			 IS_STRATA_NAME_CORRECT_OPTIONS : [
				{ label: "Yes, the strata corporation's legal name is shown correctly", val: "true"},
				{ label: "No, I need to update the strata corporation's legal name", val: "false"},
			],
			
			 IS_STRATA_ADDRESS_CORRECT_OPTIONS : [
				{ label: "Yes, the mailing address is shown correctly for the strata corporation", val: "true"},
				{ label: "No, I need to update the mailing address for the strata corporation", val: "false"},
			],
		
		
		
			BUSINESS_TYPE_OPTIONS : [
				{ label: "Corporation", val: "Corporation"},
				{ label: "Sole Proprietorship", val: "Sole Proprietorship"},
				{ label: "Partnership", val: "Partnership"},
				{ label: "Society/Non-profit", val: "Society/Non-profit"},
				{ label: "Other", val: "Other"},
			],		
		
			FORMAL_COMMUNICATION_OPTIONS: [
				{ label: "Email", val: "Email"},
				{ label: "Mail", val: "Mail"},
				{ label: "Fax", val: "Fax"},
			],
		
			INFORMAL_COMMUNICATION_OPTIONS: [
				{ label: "Email", val: "Email"},
				{ label: "Phone and mail", val: "Phone and mail"}
			],
        
            CONTACT_US_COMMUNICATION_OPTIONS: [
                { label: "Email", val: "Email" },
				{ label: "Phone", val: "Phone" },
                { label: "I will print this form and contact you at 1-888-888-8888", val: "Pickup"}
			],
	
	
			USE_REPRESENTATION_OPTIONS  : [
						{ label: "No", val: "false"},
                        { label: "Yes, and they agreed to represent me", val: "true"}
					],
		
			NO_YES_OPTIONS : [
						{ label: "No", val: "false"},
                        { label: "Yes", val: "true"}
					],
		
			SPECIAL_ACCOMODATION_OPTIONS :[
				{ label: "Difficulty reading and writing", val: "Difficulty reading and writing"},
				{ label: "English speaking difficulty", val: "English speaking difficulty"},
				{ label: "Visual impairment", val: "Visual impairment"},
				{ label: "Hearing impairment", val: "Hearing impairment"},
				{ label: "Mental health issues", val: "Mental health issues"},
				{ label: "Other", val: "Other" },
			],
		
		
			CLAIM_SCALE_OPTIONS : [
				{ labelHTML: "I agree ", val: "1"},
				{ labelHTML: "I disagree  ", val: "0"},
				{ labelHTML: "No opinion", val: "2"}
			],
			
			CLAIM_REMEDY_SCALE_OPTIONS : [
				{ labelHTML: "The description is accurate", val: "1"},
				{ labelHTML: "The description is not accurate", val: "0"},
				{ labelHTML: "No opinion", val: "2"}
			],
		
			CONTACT_ADDRESS_OPTIONS : [
				{ label: "Same as organization", val: "true"},
				{ label: "Use a different address", val: "false"},
			]
		
		
		
	};
});

