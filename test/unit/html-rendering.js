module("html-rendering");

test("jQuery.HTMLRendering.setHTML actually renders HTML", function () {
  var div = $("#test-rendering");
  
  var htmlRendering = new jQuery.HTMLRendering(div);
  htmlRendering.setHTML("Monkeys are cool");
  
  equals($("#test-rendering").html(), "Monkeys are cool");

  htmlRendering.destroy();
});
