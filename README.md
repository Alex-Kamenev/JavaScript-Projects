# JavaScript learning projects

Early web-development exercises:

- **Drum Kit:** mouse/keyboard sound pads (`w a s d j k l`).
- **Simple Dice Game:** reload the page to roll two dice.
- **Simon Game:** start with a key, then repeat the growing color sequence.
- **Calculator:** Express addition and BMI form exercises.
- **WeatherProject:** an Express client for OpenWeather's current weather API.

The three browser-only projects can be served from this directory with `python -m http.server 8000`; open the relevant project's HTML page. Simon uses the compatible jQuery 3.7.1 release from the [official CDN](https://releases.jquery.com/jquery/).

For the Node projects, enter the project's directory and install dependencies with `npm install`. Then use `npm start`. They default to port 3000 and should be run separately. For WeatherProject, set `OPENWEATHER_API_KEY` in the process environment before starting (the `.env.example` documents the names; `.env` files are not loaded automatically):

```powershell
$env:OPENWEATHER_API_KEY = "your-own-key"
npm start
```

Run the weather client's offline regression checks with `npm test` from `WeatherProject`. They verify split response chunks, parameter encoding, API failures, malformed data and HTML escaping, without contacting OpenWeather. A previously hardcoded key has been removed; its owner must revoke/rotate it with OpenWeather because Git history retains old versions.

Run Calculator's HTTP validation checks with `npm test` from `Calculator`. From the repository root, `node --test tests/browser-games.test.js` checks keyboard handling and Simon's round transitions in a small simulated DOM. It does not replace a visual browser check.

These are learning projects rather than production services. `newsLetter.txt` records an old Heroku demo address whose availability is not maintained.
