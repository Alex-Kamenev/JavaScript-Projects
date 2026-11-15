var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var userClickedPattern = [];
var started = false;
var level = 0;
var nextSequenceTimer = null;

$(document).keypress(function() {
  if (!started) {
    nextSequence();
    started = true;
  }
});

$('.btn').click(function() {
  if (!started || nextSequenceTimer !== null) return;
  var userChosenColour = $(this).attr('id');
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);
  checkAnswer(userClickedPattern.length - 1);

});

function checkAnswer(currentLevel) {
    if (userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
      if (userClickedPattern.length === gamePattern.length) {
        nextSequenceTimer = setTimeout(function() {
          nextSequenceTimer = null;
          nextSequence();
        }, 1000);
      }
    } else {
      startOver();
      playSound("wrong");
      $("body").addClass("game-over");
      $(".level-title").text("Game Over, Press Any Key to Restart");
      setTimeout(function() {
        $("body").removeClass("game-over");
      }, 100);
    }
}

function nextSequence() {
  userClickedPattern = [];
  nextLeve();

  var randomNumber = Math.floor(Math.random() * 4);
  var randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);

  $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(randomChosenColor);
}

function playSound(name) {
  var audio = new Audio('sounds/' + name + '.mp3');
  audio.play();
}

function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(function() {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}

function nextLeve() {
  level++;
  $(".level-title").text("Level " + level);
}

function startOver() {
  clearTimeout(nextSequenceTimer);
  nextSequenceTimer = null;
  level = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
}
