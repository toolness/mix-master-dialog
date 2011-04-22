module("editor");

test("setupEditor triggers onChange on init", function() {
  var wasCalled = false;
  var textContent = "Monkeys are cool!";
  var editorObj = new jQuery.Editor("test-editor-div", textContent, 
    function onChange(t) {
      equals(t, textContent, 
             "onChange must receive initial contents");
      wasCalled = true;
    });

  ok(wasCalled, "onChange handler must be triggered");
  editorObj.destroy();
});

test("setupEditor initializes default content", function() {
  var textContent = "Sheep are cool!";
  var editorObj = new jQuery.Editor("test-editor-div", textContent,
                                    function onChange() {
                                    });
  equals(editorObj.getText(), textContent);
  editorObj.destroy();
});
