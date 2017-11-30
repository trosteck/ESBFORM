define(["jquery", "underscore", "backbone", "utilities", "loader", "router", "moment", 'views/page_view', 'text!templatePath/application_receipt_page_template.html'], 
	   function($, _, Backbone, Utilities, PageLoader, Router, Moment, PageView, ApplicationReceiptPageTemplate) {

    var ApplicationReceiptPageView = PageView.extend({
        template: _.template(ApplicationReceiptPageTemplate),
        
        display_mappings: new Map([
            ['person_first_name', 'Your legal first name'],
            ['person_last_name', 'Your legal last name'],
            ['other_names', 'Other names'],
            ['birth_date', 'Date of Birth'],
            
            ['special_accomodations', 'Service requests'],
            ['special_accomodation_other_text', 'Other service requests'],
            
            ['name_of_other_parent', 'Name of other parent'],
            ['number_of_children', 'Number of children'],
            
            ['address_line_1', 'Address'],
            ['address_line_2', 'Address Line 2'],
            ['country', 'Country'],
            ['province', 'Province'],
            ['state', 'State'],
            ['city', 'City'],
            ['postal_zip', 'Postal/Zip Code'],
            
            ['contact_us', 'Contact preference'],
            ['email_address', 'Email address'],
            ['phone_numbers', 'Phone number(s)'],
                
            ['additional_information', 'Additional Information']
        ]),
        
        convertToDisplayValues: function(applicationPageData) {
            var display_values = new Map();
            
            /*
            if (applicationPageData.country === 'Canada') {
                applicationPageData.display_province = applicationPageData.province;
            } else if (applicationPageData.country === 'US') {
                applicationPageData.display_province = applicationPageData.state;
            }
            */
            
            //display_values.set('Transaction ID', respnsePageModel.get('transactionID'));
            
            this.display_mappings.forEach(function(val, key) {
                if (_.has(applicationPageData, key)) {
                    display_values.set(val, applicationPageData[key]);
                }
            });
			
            //display_values.set('Date Submitted', Moment().format('MMMM D, YYYY'));
            
            return display_values;
        },
        
        render: function() {
            
            Utilities.hide_loading();
            
            var applicationPageModel = this.model.get('parent').get('applicationPageModel'),
                applicationPageData = applicationPageModel.getData();
            
            console.log(applicationPageModel);
            console.log(applicationPageData);
            
            var display_values = this.convertToDisplayValues(applicationPageData);
            this.model.set('display_values', display_values);
			this.$el.html(this.template({
                report_values: display_values
            }));
	
            Utilities.DRS.initializeAllForms(this.$el);
            
            // After first init, clear front-end models
            
            
            PageLoader.stop();
            return this;
        },
        
        createTextEmail: function() {
            var email_body = 'Your information has been received.<br/><br/>Information provided:<br/>';
            this.model.get('display_values').forEach(function(value_text, label_name) {
                if (!label_name || !value_text) {
                    return;
                }
                email_body += label_name +': ' + value_text + '<br/>';
            });
            email_body += 'Do not reply to this email. Replies are not monitored.<br/><br/>Civil Resolution Tribunal<br/>www.civilresolutionbc.ca'
            
            return email_body;
        },
        
        createHtmlEmail: function() {
            var email_body = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' + 
        '<html xmlns="http://www.w3.org/1999/xhtml">' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
        '<title>Civil Resolution Tribunal - Proof of Notice</title>' +
        '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>'+
        '</head>'+
        '</html>'+
        '<body style="margin: 0; padding: 0; font-family:arial, san-serif; font-size:16px; color:#333;">'+
        '<table style="border:0px; padding:0px; margin:20px; min-width:600px; max-width:800px;">'+
        '<tr><td colspan="2" style="height:20px; padding:5px 0px; font-family:Century Gothic, Lucida Sans Unicode, Lucida Grande, sans-serif; font-size:20px;">Proof of notice has been received</td></tr>'+
        '<tr><td colspan="2" style="height:40px; padding:5px 0px; vertical-align:top;">Make sure you do this for each respondent.</td></tr>' +
        '<tr><td colspan="2" style="height:20 px; padding:px 0px; font-family:Century Gothic, Lucida Sans Unicode, Lucida Grande, sans-serif; font-size:18px; border-bottom:1px solid #B3B3B3; color:#7B7A7A">Request Details</td></tr>';
            
            this.model.get('display_values').forEach(function(value_text, label_name) {
                if (!label_name || !value_text) {
                    return;
                }
                email_body += '<tr><td style="height:25px; vertical-align:top; width:180px; padding:20px 15px 5px 5px; font-weight:bold; text-align:right;">'+label_name+'</td><td style="height:25px; vertical-align:top; padding:20px 5px 5px 5px;">'+value_text+'</td>';
            });
            
            email_body += '<tr><td colspan="2" style="height:60px; padding:5px 0px; vertical-align:bottom;"> Do not reply to this email.  Replies are not monitored.</td></tr>' +
        '<tr><td colspan="2" style="height:40px; padding:5px 0px; vertical-align:bottom; font-weight:bold;">Civil Resolution Tribunal <br />'+
        '<a style="font-weight:normal;" href="https://www.civilresolutionbc.ca/">www.civilresolutionbc.ca</a></td></tr>'+
        '</table>'+
        '</body></html>';
            
            return email_body;
        },
        
        
        sendEmailApi: function(body, emailAddress) {
            var that = this;
            console.log(body, emailAddress);
            $.ajax({
                url: 'sf.php',
                type: 'POST',
                data: {
                    action: 'send_email',
                    emailAddress: emailAddress,
                    emailBody: body
                },
                dataType: "json"
            }).then(function() {
                that.onSubmitEmailSuccess();
            }, function(error, errorMsg, statusCode) {
                console.log(error, errorMsg, statusCode);
                if (statusCode === 200) {
                    that.onSubmitEmailSuccess();
                } else {
                    that.onSubmitEmailError();
                }
            });
        },
        
        submitEmailPage: function() {
            var body = this.createTextEmail(),
                email =  this.$('.drs-email-input').val();
            
            return this.sendEmailApi(body, email);
        },
        
        onSubmitEmailSuccess: function() {
            PageLoader.stop();
            $('.page-actions .drs-email-form .drs-help-block').html(
                '<span class="glyphicon glyphicon-ok" style="padding-right:5px;"></span>Email sent').show();
            $('.page-actions .drs-email-form').addClass('has-success');
        },
        
        onSubmitEmailError: function() {
            PageLoader.stop();
            $('.page-actions .drs-email-form .drs-help-block').html(
                '<span class="glyphicon glyphicon-remove" style="padding-right:5px;"></span>Error sending email').show();
            $('.page-actions .drs-email-form').addClass('has-error');
        },
        
        events: {
            'click .drs-print-receipt': function(event) {
                window.print();
            },
            'click .drs-receipt-email-btn': function() {
                var that = this;
                
                // Register SF callbacks
                /*
                $.salesforce_interface.form_triggers.send_summary_email_success = this.onSubmitEmailSuccess;
                $.salesforce_interface.form_triggers.send_summary_email_error = this.onSubmitEmailError;
                */
                
                $(this).closest('.drs-email-form').removeClass('has-success');
                $(this).closest('.drs-email-form').removeClass('has-error');
                
                // Remove error styling
                $('.page-actions .drs-email-form .drs-help-block').hide({complete: function() {
                    $(this).closest('.drs-email-form').removeClass('has-success')
                    if (Utilities.DRS.validateVisibleChildElements(that.$('.download-print-email-section'))) {
                        PageLoader.start($('.download-print-email-section'));
                        that.submitEmailPage();
                    }
                }});
            }
        }

    });
    
    return ApplicationReceiptPageView;
});
