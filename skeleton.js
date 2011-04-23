(function (jQuery) {
  var $ = jQuery;

  function makeProtovisDOMfromDOM(dom, name) {
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

  jQuery.Skeleton = function Skeleton(targetDiv, domToBeDiagrammed, highlighter) {
    var self = this;
    var protovisDom = makeProtovisDOMfromDOM(domToBeDiagrammed, 'div');

    var vis = new pv.Panel()
                    .width(targetDiv.width())
                    .height(targetDiv.width())
                    .canvas(targetDiv.get(0));
  
    var spacing = 16;
  
    var tree = vis.add(pv.Layout.Indent)
        .nodes(protovisDom.nodes())
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
    
    self.destroy = function() {
      // TODO: Do we need to do anything with Protovis here?
      targetDiv.empty();
    };
  }
})(jQuery);