(function (jQuery) {
  var $ = jQuery;

  jQuery.HTMLRendering = function HTMLRendering(div) {
    var self = this;
    
    self.setHTML = function(html) {
      div.html(html);      
    };

    self.destroy = function() {
      div.empty();
    };    
  }
})(jQuery);
