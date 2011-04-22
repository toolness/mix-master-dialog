module("html-rendering");

test("setHTML actually renders HTML", function () {
  var div = $("#test-rendering");
  
  var htmlRendering = new jQuery.HTMLRendering(div);
  htmlRendering.setHTML("Monkeys are cool");
  
  equals($("#test-rendering").html(), "Monkeys are cool");

  htmlRendering.destroy();
});

test("specified baseURL is used for relatives", function() {
  var div = $("#test-rendering");
  var r = new jQuery.HTMLRendering(div, "http://mozilla.org/foo/");
  r.setHTML('<a href=".">hi</a>');
  equals(div.find("a").get(0).href, "http://mozilla.org/foo/");
  r.destroy();
});

test("unspecified baseURL uses dialog's base URL for relatives", function() {
  equals($("base").length, 0);
  
  var div = $("#test-rendering");
  var r = new jQuery.HTMLRendering(div);
  r.setHTML('<a href=".">hi</a>');
  equals(div.find("a").get(0).href, window.location.href);
  r.destroy();
});

