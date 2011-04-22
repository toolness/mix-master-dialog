(function (jQuery) {
  var $ = jQuery;

  jQuery.makeProtovisDOMfromDOM = function makeProtovisDOMfromDOM(dom, name) {
    var pvNode = new pv.Dom.Node();
    pvNode.nodeName = name;
    var childNode;

    dom = $(dom).get(0);
    pvNode.realDOMNode = dom;
    for (var i = 0; i < dom.childNodes.length; i++) {
      var node = dom.childNodes[i];
      switch (node.nodeType) {
        case node.ELEMENT_NODE:
        var name = node.nodeName.toLowerCase();
        childNode = makeProtovisDOMfromDOM($(node), name);
        childNode.realDOMNode = node;
        pvNode.appendChild(childNode);
        break;
      }
    }
    return pvNode;
  }

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

  jQuery.makeSkeleton = function makeSkeleton(div, dom, highlighter) {
    var vis = new pv.Panel()
                    .width(div.width())
                    .height(div.width())
                    .canvas(div.get(0));
  
    var spacing = 16;
  
    var tree = vis.add(pv.Layout.Indent)
        .nodes(dom.nodes())
        .depth(spacing * 2)
        .breadth(spacing * 2);

    tree.link.add(pv.Line);
  
    var node = tree.node.add(pv.Panel)
        .top(function (n) { return n.y - spacing; })
        .height(spacing * 2)
        .right(spacing)
        .strokeStyle(null);

    node.anchor("left").add(pv.Dot)
        .strokeStyle(function(d) {
          return $.colorForTag(d.nodeName);
        })
        .fillStyle(function(d) {
          return $.makeRGBA($.colorForTag(d.nodeName), 0.5);
        })
        .event("mouseover", highlighter.over)
        .event("mouseout", highlighter.out)
        // Click handler is for touch-based devices.
        .event("click", highlighter.over)
        .size(200)
        .anchor("right").add(pv.Label)
        .font("9pt Monaco, monospace")
        .text(function(d) { return d.nodeName; });

    vis.render();
  }
})(jQuery);