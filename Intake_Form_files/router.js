define(["jquery", "underscore", "backbone", 'utilities'], function($, _, Backbone, Utilities) {

    var PageRouter = Backbone.Router.extend({
        routes: {
            "application": 'loadApplication',
            "application-receipt": 'loadApplicationReceipt',
            "*path": 'defaultRoute'
        },
		
        defaultRoute: function() {
          this.navigate("application", {trigger: true, replace: true});
        },
		
		
		initialize: function(options){
			var that = this;

			this.on('route', function(router, route, params) {

				if(that.titles) {
					if(that.titles[router]) document.title = that.titles[router];
					else if(that.titles.default) document.title = that.titles.default;
					else throw 'Backbone.js Router Title Helper: No title found for route:' + router + ' and no default route specified.';
				}
			});
		}
		
		
    });
    PageRouter.getInstance = function () {
        if (this._instance === undefined) {
            this._instance = new this();
        }
        return this._instance;
    };

    var initialize = function(mainModel) {

        var pageRouter = PageRouter.getInstance();

        pageRouter.on("route:loadApplication", function() {
            mainModel.switchToPage('applicationPage');
        });
        
        pageRouter.on("route:loadApplicationReceipt", function() {
            mainModel.switchToPage('applicationReceipt');
        });
		
        Backbone.history.start();
    };

    return {
        initialize: initialize,
        getInstance: function() { return PageRouter.getInstance(); }
    };
});
