module("main");

test("setupUI renders changes in editor to HTML", function () {
  var rendering = $("#test-rendering");
  var startHTML = "<p>this is <em>html</em>.</p>";
  var ui = jQuery.setupUI({
    rendering: rendering,
    skeleton: $("#test-skeleton"),
    defaultHudContent: "boop",
    defaultEditorContent: startHTML,
    idToEdit: "test-editor-div"
  });
  equals(rendering.html(), startHTML);
  ui.destroy();
});

test("setupUI causes HUD to initialize", function () {
  var rendering = $("#test-rendering");
  var startHTML = "<p>this is <em>html</em>.</p>";
  var ui = jQuery.setupUI({
    rendering: rendering,
    skeleton: $("#test-skeleton"),
    defaultHudContent: "boop",
    defaultEditorContent: startHTML,
    idToEdit: "test-editor-div"
  });
  equals($(".webxray-hud").text(), "boop");
  
  ui.destroy();
});

test("setupUI causes the SVG skeleton element to appear", function () {
  var rendering = $("#test-rendering");
  var startHTML = "<p>this is <em>html</em>.</p>";
  var ui = jQuery.setupUI({
    rendering: rendering,
    skeleton: $("#test-skeleton"),
    defaultHudContent: "boop",
    defaultEditorContent: startHTML,
    idToEdit: "test-editor-div"
  });
  equals($("#test-skeleton svg").length, 1);
  
  ui.destroy();
});
