(function (jQuery) {
  var $ = jQuery;

  var START_HTML = 
    "<p>I had <em>nothing</em> to do with it.</p>\n\n" +
    "<p>And you are a goose.</p>";

  var START_HUD_HTML =
    "<span>Play around with the HTML code and move your mouse " +
    "over the DOM diagram to learn how Web pages work.</span>";

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

  function createHighlighter(hud, focusedOverlay) {
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

  function makeSkeleton(div, dom, highlighter) {
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

  jQuery.setupEditor = function (idToEdit, onChange) {
    function onChangeWrapper() {
      var text = getText();
      onChange(text);
    }

    function getText() {
      return session.getDocument().getValue();
    }
    
    // The default Mac keybindings map Command-L to 'go to line #',
    // which both isn't needed for this page and also overrides
    // the browser-default behavior of selecting the address bar,
    // so we'll disable it.
    var mac = require("ace/keyboard/keybinding/default_mac");
    delete mac.bindings.gotoline;

    var editor = ace.edit(idToEdit);
    editor.setTheme("ace/theme/eclipse");
    var HTMLMode = require("ace/mode/html").Mode;
    var session = editor.getSession();
    session.setMode(new HTMLMode());
    editor.renderer.setShowGutter(false);
    editor.setHighlightActiveLine(false);
    session.setUseWrapMode(true);
    session.setWrapLimitRange(36, 36);
    session.getDocument().on("change", onChangeWrapper);
    onChangeWrapper();
    
    return ( { getText: getText } );
  }

  jQuery.setupMixMaster = function() {
    var rendering = $("#rendering div.content");
    var skeleton = $("#skeleton div.content");

    var defaultContent = START_HUD_HTML;
    var startHTML = START_HTML;
    var isInIframe = !(top === self);

    function start() {
      var hud = jQuery.hudOverlay({defaultContent: defaultContent});
      var focusedOverlay = jQuery.focusedOverlay();
      var highlighter = createHighlighter(hud, focusedOverlay);

      $(document.body).append(hud.overlay);

      $("pre#editor").text(startHTML);

      jQuery.setupEditor("editor", function onChange(text) {
        rendering.html(text);
        makeSkeleton(skeleton, makeProtovisDOMfromDOM(rendering, 'div'),
                     highlighter);
      });
    }

    var sendMessage;
    var responseSent = false;
    var isStarted = false;

    function onMessage(data) {
      if (isStarted)
        return;
      isStarted = true;
      var base = document.createElement('base');
      base.setAttribute('href', data.baseURI);
      $(document.head).append(base);
      $("#header h1").text(data.title);
      var editorHeight = $(window).height() / 2;
      $("#editor").height(editorHeight);
      $("#editor-container").height(editorHeight);      
      defaultContent = data.instructions;
      startHTML = data.startHTML;
      start();
    }
    if (isInIframe) {
      window.addEventListener("message", function(event) {
        if (event.data && event.data.length && event.data[0] == '{') {
          onMessage(JSON.parse(event.data));
        }
      }, false);
      sendMessage = function sendMessageViaPostMessage(data) {
        window.parent.postMessage(JSON.stringify(data), "*");
      }
    } else {
      // We're developing this app in a window, so trigger the
      // dialog API calls with dummy data.
      onMessage({
        title: "Here is a title.",
        instructions: "Here are instructions.",
        startHTML: "<p>Here is starting HTML.</p>",
        baseURI: "http://www.mozilla.org/"
      });
      sendMessage = function fakeSendMessage(data) {
        alert("Sending the following to parent window: " +
              JSON.stringify(data));
      }
    }
    $("#nevermind.button").click(function() {
      if (!responseSent) {
        sendMessage({msg: 'nevermind'});
        responseSent = true;
      }
    });
    $("#ok.button").click(function() {
      if (!responseSent) {
        sendMessage({msg: 'ok', endHTML: $("pre#editor").text()});
        responseSent = true;
      }
    });
  }

})(jQuery);