const express = require("express");
const { getWeather, escapeHtml } = require("./weather");

const app = express();
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", async function (req, res) {
  const city = typeof req.body.cityName === "string" ? req.body.cityName.trim() : "";
  if (!city || city.length > 120) return res.status(400).send("Enter a city name (up to 120 characters).");
  if (!process.env.OPENWEATHER_API_KEY) return res.status(503).send("Weather service is not configured.");
  try {
    const weather = await getWeather(city, process.env.OPENWEATHER_API_KEY);
    const icon = /^[0-9]{2}[dn]$/.test(weather.weather[0].icon) ? weather.weather[0].icon : "01d";
    res.send("<h1>The temperature in " + escapeHtml(city) + " is " + weather.main.temp + " degrees Celsius.</h1>" +
      "<p>The weather is currently " + escapeHtml(weather.weather[0].description) + "</p>" +
      '<img alt="Weather icon" src="https://openweathermap.org/img/wn/' + icon + '@2x.png">');
  } catch (error) {
    res.status(error.status === 404 ? 404 : 502).send(error.status === 404 ? "City not found." : "Weather service is temporarily unavailable.");
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log("Weather server listening on port " + port));
}
module.exports = app;
