const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("./app");

test("weather form validates city and reports missing configuration without an upstream request", async () => {
  const previousKey = process.env.OPENWEATHER_API_KEY;
  delete process.env.OPENWEATHER_API_KEY;
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.on("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  const post = values => fetch(base, { method: "POST", body: new URLSearchParams(values) });
  try {
    assert.equal((await fetch(base)).status, 200);
    assert.equal((await post({ cityName: "" })).status, 400);
    assert.equal((await post({ cityName: "New York" })).status, 503);
  } finally {
    if (previousKey === undefined) delete process.env.OPENWEATHER_API_KEY;
    else process.env.OPENWEATHER_API_KEY = previousKey;
    await new Promise(resolve => server.close(resolve));
  }
});
