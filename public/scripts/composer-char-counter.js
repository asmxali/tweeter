$(document).ready(function() {
  // when a character is inputted into the textarea of the form:
  // the counter should count the characters left until 140
  // when passes 140 character count it should return the amount of characters passed the limit in red font color
  $(".new-tweet textarea").on("input", function() {
    let input = $(this).val().length;
    let maxChar = 140;
    let remainder = maxChar - input;
    if (input <= 140) {
      extraChar = 0;
      $(".counter")
        .text(remainder)
        .css("color", "black");
    }
    if (input > 140) {
      $(".counter")
        .text(remainder)
        .css("color", "red");
    }
  });
});
