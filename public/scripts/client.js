// function to escape characters that otherwise have a special meaning like <
// used to prevent users from inputting text to alter JavaScript
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

// performs a get request to obtain tweet array
// calls renderTweet on tweet array
const loadTweets = () => {
  $.ajax({
    url: "/tweets/",
    type: "GET",
    dataType: "JSON"
  }).then(response => {
    renderTweets(response);
  });
};

const renderTweets = function(tweets) {
  $("#tweets-container").empty();
  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container
  for (let tweet of tweets) {
    let $tweetContainer = createTweetElement(tweet);
    $("#tweets-container").prepend($tweetContainer);
  }
};

const createTweetElement = function(tweetData) {
  let safeHTML = `       <article class = "tweet">
  <header>
  <img src="${tweetData.user.avatars}"> 
  <span class = "name" >${tweetData.user.name}</span>
  <span class= "handle" > ${tweetData.user.handle} </span>
  </header>
  <span class = "tweet-body"> ${escape(tweetData.content.text)} </span> 
  <footer>
  <a class="date"> 2 days ago</a>
  <a class= "tweet-buttons"> 
  <i class="material-icons">favorite</i>
  <i class="material-icons">replay</i>
  <i class="material-icons">mode_comment</i>
  </a>
  </footer>
  </article> `;

  return safeHTML;
};

$(document).ready(function() {
  $("a").click(function() {
    // toggles form to create tweet
    $("#tweet-button").slideToggle();
    $("textarea").focus();
  });

  const $form = $("#tweet-button");

  //once a tweet is submitted:
  // 1. hides error message upon new tweet submission
  // 2. appends new tweet based off of input from form
  // 3. returns alert for null, empty string inputs or tweets over 140 characters
  $form.on("submit", function(event) {
    //     1     //
    $(".error-message").slideUp();
    $(".error-message").empty();
    event.preventDefault();
    console.log("Button clicked, performing ajax call...");
    const form = $form.serialize();
    let input = $(".new-tweet textarea");
    const blacklistedValues = [null, ""];

    //    2 & 3   //
    if (blacklistedValues.includes(input.val())) {
      $(".error-message").append(`
    <style>
    .error-message {
      font-family: sans serif;
      font-size: 20px;
      border: 2px solid red;
      color:red;
      margin-left:15px;
      }
    </style>
    <span> &#9888 You haven't tweeted anything yet. &#9888 </span>`);
      $(".error-message").slideDown("slow");
    } else if (input.val().length >= 140) {
      $(".error-message").append(`
    <style>
    .error-message {
      font-family: sans serif;
      font-size: 20px;
      border: 3px solid red;
      color:red;
      }
    </style>
    <span> &#9888 You have passed the max character limit. &#9888 </span>`);
      $(".error-message").slideDown();
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: form
      }).then(response => {
        loadTweets();
        input.val("");
        $(".counter").empty();
        $(".counter").append("140");
      });
    }
  });

  loadTweets();
});
