const https = require("node:https");

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function getWeather(city, apiKey, request = https.get) {
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.search = new URLSearchParams({ q: city, appid: apiKey, units: "metric" }).toString();
  return new Promise((resolve, reject) => {
    const req = request(url, response => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", chunk => { body += chunk; });
      response.on("error", reject);
      response.on("end", () => {
        if (response.statusCode !== 200) {
          const error = new Error("Weather request failed");
          error.status = response.statusCode;
          return reject(error);
        }
        try {
          const weather = JSON.parse(body);
          if (!Number.isFinite(weather.main?.temp) || typeof weather.weather?.[0]?.description !== "string") {
            throw new Error("Invalid weather response");
          }
          resolve(weather);
        } catch (error) { reject(error); }
      });
    });
    req.on("error", reject);
    req.setTimeout(10000, () => req.destroy(new Error("Weather request timed out")));
  });
}

module.exports = { getWeather, escapeHtml };
