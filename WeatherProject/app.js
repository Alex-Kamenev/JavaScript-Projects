const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));


app.get("/", function(req, res) {

  res.sendFile(__dirname + "/index.html");

});

app.post("/", function(req, res) {

  const query = req.body.cityName;
  const apiKey = "0dcffbe6ee49924be8b014abe0987a47";
  const units = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&APPID=" + apiKey + "&units=" + units;

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      //take a JSON format and unpacks it into a JavaScript object
      const weatherData = JSON.parse(data);
      //targets a specific part of the data provided from the JSON from the API
      const temp = weatherData.main.temp;
      //remember the info comes in arrays
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      var imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write("<h1>The tempreture in " + query + " is " + temp + " degrees Celcius.</h1>");
      res.write("<p>The weather is currently " + weatherDescription + "</p>");
      res.write("<img src=" + imageURL + ">");
      res.send();
    })
  })
});



app.listen(3000, function() {
  console.log("Server running on port 3000");
});




//For example perpuses - creates a JavaScript object - will use it to pack it into JSON
// console.log(weatherData);
// const object = {
//   name: "Aleks",
//   favFood: "pizza",
// }
//takes a JavaScript object and packs it to a JSON format
// console.log(JSON.stringify(object));
