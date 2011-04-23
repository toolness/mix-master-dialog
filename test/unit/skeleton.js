module("skeleton");

test("skeleton contains same # of circles as DOM elements", function() {
  var div = $("#test-skeleton");
  var rend = $("#test-rendering");
  
  rend.html("<p>hi<em>there</em></p>");
  var skel = new jQuery.Skeleton(div, rend, {});
  equals($("div circle").length,
         2 + 1 /* One extra for the root <div> element in the skeleton. */ );
  skel.destroy();
});
