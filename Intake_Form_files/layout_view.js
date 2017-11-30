define(["jquery", "underscore", "backbone", 'loader', 'views/header_view','views/footer_view',  'text!templatePath/layout_template.html'],
    function($, _, Backbone, PageLoader, HeaderView, FooterView, LayoutTemplate) {

    var LayoutView = Backbone.View.extend({
        el: '#page-content-container',
        child: null,
        template: _.template(LayoutTemplate),
        menuModel: null,

        header_view: null,
        menu_view: null,
        footer_view: null,
        
        initialize: function(options) {
            
            this.header_view = new HeaderView();
            //this.menu_view = new MenuView({ model: this.menuModel });
            this.footer_view = new FooterView();
        },

        render: function() {
            this.$el.html(this.template);
            this.renderHeader();
            this.renderFooter();
            return this;
        },

        renderHeader: function() {
            this.$("#header").html(this.header_view.render().el);
        },
        
        renderMenu: function(current_step) {
            this.$("#menu").html(this.menu_view.render().el);
            this.menu_view.listenTo(this.header_view, 'show_menu', this.menu_view.showMenu);
        },
        
        renderFooter: function() {
            this.$("#footer").html(this.footer_view.render().el);
        },

        renderContent: function(contentView) {
            this.removeChild();
            this.$("#content").html((this.child = contentView).render().el);
            contentView.delegateEvents();
            contentView.init_state();
            
        },

        hasChild: function() {
            return (this.child !== null);
        },

        removeChild: function() {
            if(this.hasChild()) {
                this.child.destroyView();
                this.child.remove();
            }
        }
    });

    return LayoutView;
});
