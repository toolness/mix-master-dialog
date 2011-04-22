module("html-rendering");

test("setHTML actually renders HTML", function () {
  var div = $("#test-rendering");
  
  var htmlRendering = new jQuery.HTMLRendering(div);
  htmlRendering.setHTML("Monkeys are cool");
  
  equals($("#test-rendering").html(), "Monkeys are cool");

  htmlRendering.destroy();
});


test("destroy clears out old content from the div", function () {
  var div = $("#test-rendering");
  
  var htmlRendering = new jQuery.HTMLRendering(div);
  htmlRendering.setHTML("Monkeys are cool");
  htmlRendering.destroy();

  equals(div.html(), "");
  
});
