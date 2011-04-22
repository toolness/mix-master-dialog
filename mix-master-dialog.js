(function (jQuery) {
  var $ = jQuery;

  jQuery.createHighlighter = function createHighlighter(hud, focusedOverlay) {
    return {
      over: function(d) {
        var node = d.realDOMNode;
        if (focusedOverlay.element == node)
          return;
        focusedOverlay.set(node);

        var parent = node.parentNode;

        // TODO: This is a dumb hack to make the root node seem as
        // simple as we tell the user it is. But we should actually just
        // structure the DOM simply instead of intervening here.
        if ($(node).is("div.content"))
          node = document.createElement("div");
        if ($(parent).is("div.content"))
          parent = document.createElement("div");
        if ($(parent).is("div.column"))
          parent = null;

        hud.onFocusChange({element: node, ancestor: parent});
      },

      out: function(d) {
        focusedOverlay.unfocus();
        hud.onFocusChange({element: null, ancestor: null});
      }
    };
  }
})(jQuery);