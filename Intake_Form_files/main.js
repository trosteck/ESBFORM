

// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones,
requirejs.config({
    'baseUrl': 'js',
    'paths': {
      'templatePath': '../templates',
      'text': '../../global_js/text',
      'es6-shim': '../../global_js/es6-shim',
      'jquery-ui': '../../global_js/jquery-ui',
      'bootstrap': '../../global_js/bootstrap.min',
      'backbone': '../../global_js/backbone',
      'underscore': '../../global_js/underscore',
      'backbone-forms': '../../global_js/backbone-forms.min',
      'scrollintoview': '../../global_js/jquery.scrollintoview.min',
      'moment': '../../global_js/moment.min',
      'loader': '../../global_js/loader',
	  'mailcheck': '../../global_js/mailcheck.min',
	  'Modernizr': '../../global_js/modernizr'
    },
    'shim': {
		'Modernizr': {
            exports: 'Modernizr'
        },
	  'scrollintoview': ['jquery'],
      'jquery-ui': ['jquery'],
      'bootstrap': ['jquery-ui', 'jquery'],
      'loader': ['jquery']
    }
});

var debug = {};

// For loading jquery first.  Required to have SF interace on VF page and use jquery before requirejs is loaded
define('jquery', [], function() {
    return jQuery;
});

// Load the main app module to start the app
requirejs(['jquery', 'app', 'utilities', 'bootstrap', 'jquery-ui', 'moment', 'es6-shim'], function($, App, Utilities) {
    Utilities.show_loading();
    App.initialize();
    
    if (_.has($, 'RunTimeConvert')) {
        $.RunTimeConvert();
    }
});
