define([], function() {

    var LOADER_TIMEOUT_MILLISECONDS = 15000;
    var LOADER_ID = '#loader';
    
    var PAGE_LOADER_HTML = ''+
        '<div id="loader">'+
            '<div class="loading-container"></div>'+
            '<div class="loading-parent">'+
                '<div class="loading-icon"></div>'+
            '</div>'+
        '</div>';
    
    var COMPONENT_LOADER_HTML = ''+
        '<div id="loader">'+
            '<div class="loading-container-in-div"></div>'+
            '<div class="loading-parent-in-div">'+
                '<div class="loading-icon loading-icon-in-div"></div>'+
            '</div>'+
        '</div>';

    // Singleton class to show only one loading indicator at a time
    function PageLoader() {
        if (PageLoader.prototype._singletonInstance) {
          return PageLoader.prototype._singletonInstance;
        }
        PageLoader.prototype._singletonInstance = this;
        
        this.isLoading = false;
        this.loaderTimeout;
        this.noBodyScroll = false;
        this.noHtmlScroll = false;
    }
    PageLoader.prototype = {
        constructor: PageLoader,
        start: function(element, timeout) {
            // If valid jQuery selector element is passed in, it will insert
            // the loading screen div as first child of that element.
            // Loader will be auto-centered to element if that element has
            // position:relative, or to its first position:relative parent otherwise.
            if (this.isLoading) {
                // Prevent double clicks
                return;
            }
            if (!element || element.length === 0) {
                //console.debug("[Warning] No element found for loader");
                return;
            }
            
            if (element.length > 1) {
                //console.debug("[Warning] More than one element passed in.  May result in unexpected behaviour");
            }
            
            //console.debug("Inserting loader")
            // Create the loader HTML as a sibling of element passed in
            var loader = element.is('body')? $(PAGE_LOADER_HTML) : $(COMPONENT_LOADER_HTML);
            element.prepend(loader);
            this.isLoading = true;
            
            this.loaderElement = loader;
            
            // Disable scrolling underneath the loading screen.  Track if it was disabled previously
            if ($("body").hasClass("remove-scroll")) {
                this.noBodyScroll = true;
            } else {
                $("body").addClass("remove-scroll");
            }
            
            if ($("html").hasClass("remove-scroll")) {
                this.noHtmlScroll = true;
            } else {
                $("html").addClass("remove-scroll");
            }
            
            // Disable scrolling on mobile
            $(document).on("touchmove.loader", function(evt) { evt.preventDefault() });
            //Disable clicks
            this.loaderElement.click(function(event) {
                event.stopPropagation();
            });
            
			
            this.loaderTimeout = this.startLoaderTimeout(timeout);
        },
        // Add an option to keep the scroll removed.  Used on infoWindows
        stop: function(removeScroll) {
            removeScroll = removeScroll || false;
            if (this.loaderTimeout) {
                clearTimeout(this.loaderTimeout);
            }
            this.loaderTimeout = null;
            
            if (!this.loaderElement) {
                //console.debug("Nothing to stop");
                return;
            }
            // Re-enable scrolling beneath the loading screen if it was enabled initially
            if (!this.noBodyScroll) {
                $("body").removeClass("remove-scroll");
            }
            if (!this.noHtmlScroll) {
                $("html").removeClass("remove-scroll");
            }
            
            $(document).off("touchmove.loader");
            this.isLoading = false;
            
            //Re-scope loader element and remove it
            var scopedLoaderId = $(this.loaderElement).attr('id');
            this.loaderElement.remove();
            if (scopedLoaderId) {
                $('#'+scopedLoaderId).remove();
            }
            
            this.noBodyScroll = false;
            this.noHtmlScroll = false;
        },
        startLoaderTimeout: function(timeout) {
            var loader_timeout = timeout || LOADER_TIMEOUT_MILLISECONDS;
            var pageLoader = this;
            var callback = function() {
                if ($(LOADER_ID)) {
                    //console.debug("LOADER TIMED OUT -> '\n\tError window? Callback?");
                    pageLoader.stop();
                }
            };
            return setTimeout(callback, loader_timeout);
        }
    }
        
    return new PageLoader();
});