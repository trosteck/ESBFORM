define(["jquery",
        "underscore",
        "backbone",
        'router',
        "utilities",
        'loader',
        'models/application_page_model',
        'models/application_receipt_page_model',
		'views/layout_view',
        'views/application_page_view',
        'views/application_receipt_page_view'
   ], function($,
                _,
                Backbone,
                Router,
                Utilities,
                PageLoader,
                ApplicationPageModel,
                ApplicationReceiptPageModel,
                LayoutView,
                ApplicationPageView,
                ApplicationReceiptPageView
   ) {

    var MainModel = Backbone.Model.extend({
        layoutView: null,

		//_original
        defaults: {
			dispute_number: null,
			respondent_pin: null,
			dispute_priority: null, // Normal or urgent
			response_completed_date: null,
			response_due_date: null,
			respondent_type: null,
			owner_or_tenant: null,
			claims: null
        },

        initialize: function() {
            this.layoutView = new LayoutView({ el: '#page-content-container'});
            this.initApplication();
        },

        initApplication: function() {
            this.layoutView.render();
            this.parse();

            //this.switchToPage('');
        },

        parse: function() {


            var applicationPageModel = this.get('applicationPageModel');
            if (!applicationPageModel) {
                applicationPageModel = new ApplicationPageModel({parent: this});
                this.set('applicationPageModel', applicationPageModel);
            }

            var applicationReceiptPageModel = this.get('applicationReceiptPageModel');
            if (!applicationReceiptPageModel) {
                applicationReceiptPageModel = new ApplicationReceiptPageModel({parent: this});
                this.set('applicationReceiptPageModel', applicationReceiptPageModel);
            }
        },

        switchToPage: function(pageName) {

            if (this.currentPage && this.currentPage === pageName) {
                return;
            }

            this.currentPage = pageName;
            this.layoutView.removeChild();

            switch(pageName) {
                case 'applicationPage':
                    // Reset the model on load
                    var applicationPageModel = new ApplicationPageModel({
                        parent: this
                    });
                    this.set('applicationPageModel', applicationPageModel);
                    this.layoutView.renderContent(new ApplicationPageView({ model: this.get('applicationPageModel') }));
                    break;
                case 'applicationReceipt':
                    if (!this.pageModelComplete('applicationPageModel')) {
                        this.currentPage = 'applicationPage';
                        var applicationPageModel = new ApplicationPageModel({
                            parent: this
                        });
                        this.set('applicationPageModel', applicationPageModel);
                        this.layoutView.renderContent(new ApplicationPageView({ model: this.get('applicationPageModel') }));
                        Router.getInstance().navigate('application', {trigger: false, replace:true});
                        return;
                    }

                    var applicationReceiptPageModel = new ApplicationReceiptPageModel({
                        parent: this
                    });
                    this.set('applicationReceiptPageModel', applicationReceiptPageModel);
                    this.layoutView.renderContent(new ApplicationReceiptPageView({ model: this.get('applicationReceiptPageModel') }));
                    break;
                default:
                    // TODO: Do we need to refresh the model here?
                    this.layoutView.renderContent(new ApplicationPageView({ model: this.get('applicationPageModel') }));
                    break;
			}
        },

		pageModelComplete: function(page_model_name) {
            return (this.get(page_model_name).get('pageComplete') === true);
        },

    });

    return MainModel;
});
