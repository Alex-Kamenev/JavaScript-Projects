//jshint esversion:6
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({
  extended: true,
}));

function numberInput(value) {
  return typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
}

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {

  var num1 = numberInput(req.body.num1);
  var num2 = numberInput(req.body.num2);

  var result = num1 + num2;
  if (!Number.isFinite(num1) || !Number.isFinite(num2) || !Number.isFinite(result)) {
    return res.status(400).send("Enter two finite numbers.");
  }
  res.send("The result of the calculation is: " + result);
});

app.get("/bmiCalculator", function(req, res){
  res.sendFile(__dirname + "/bmiCalculator.html");
});

app.post("/bmiCalculator", function(req, res){
  var weight = numberInput(req.body.weight);
  var height = numberInput(req.body.height);

  var bmiResult = weight/Math.pow(height, 2);
  if (!Number.isFinite(weight) || !Number.isFinite(height) || weight <= 0 || height <= 0 || !Number.isFinite(bmiResult)) {
    return res.status(400).send("Enter a positive weight in kilograms and height in meters.");
  }

  res.send("<h1>BMI Calculator</h1><br>Your BMI is: " + bmiResult);

});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log("Calculator listening on port " + port));
}
module.exports = app;
