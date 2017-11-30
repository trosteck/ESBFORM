define(["jquery", "underscore", "backbone", 'text!templatePath/footer_template.html'], function($, _, Backbone, FooterTemplate) {

    var FooterView = Backbone.View.extend({
        template: FooterTemplate,

        render: function() {
            this.$el.html(this.template);
            return this;
        }
    });

    return FooterView;
});
