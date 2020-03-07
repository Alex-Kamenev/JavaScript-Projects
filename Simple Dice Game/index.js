var dice1Rand = Math.floor((Math.random() * 6) + 1);
var dice2Rand = Math.floor((Math.random() * 6) + 1);

document.querySelectorAll("img")[0].setAttribute("src", "images/dice" + dice1Rand + ".png");
document.querySelectorAll("img")[1].setAttribute("src", "images/dice" + dice2Rand + ".png");

var player1Win = "🚩 Player 1 wins!";
var player2Win = "Player 2 wins! 🚩";
var tie = "🚩 It's a tie! 🚩";

if(dice1Rand  > dice2Rand){
  document.querySelector("h1").innerHTML = player1Win;
}
else if (dice1Rand < dice2Rand){
  document.querySelector("h1").innerHTML = player2Win;
} else {
    document.querySelector("h1").innerHTML = tie;
}
