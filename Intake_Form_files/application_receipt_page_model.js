define(["jquery", "underscore", "backbone"],
       function($, _, Backbone) {

    var ApplicationReceiptPageModel = Backbone.Model.extend({

        defaults: {
            pageComplete: false,
            parent: null
        }
    });

    return ApplicationReceiptPageModel;
});
