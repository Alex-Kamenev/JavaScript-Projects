const test = require("node:test");
const assert = require("node:assert/strict");
const { EventEmitter } = require("node:events");
const { getWeather, escapeHtml } = require("./weather");

function fakeRequest(chunks, status = 200, inspect = () => {}) {
  return (url, callback) => {
    inspect(url);
    const req = new EventEmitter();
    req.setTimeout = () => {};
    process.nextTick(() => {
      const res = new EventEmitter();
      res.statusCode = status;
      res.setEncoding = () => {};
      callback(res);
      chunks.forEach(chunk => res.emit("data", chunk));
      res.emit("end");
    });
    return req;
  };
}

test("collects split JSON and encodes city names without adding query parameters", async () => {
  const weather = await getWeather("New York &appid=wrong", "test-key", fakeRequest([
    '{"main":{"temp":12},', '"weather":[{"description":"cloudy","icon":"04d"}]}'
  ], 200, url => {
    assert.equal(url.searchParams.get("q"), "New York &appid=wrong");
    assert.equal(url.searchParams.get("appid"), "test-key");
  }));
  assert.equal(weather.main.temp, 12);
});

test("rejects city-not-found, malformed JSON and missing fields", async () => {
  await assert.rejects(getWeather("missing", "key", fakeRequest(['{}'], 404)), { status: 404 });
  await assert.rejects(getWeather("city", "key", fakeRequest(['{'])));
  await assert.rejects(getWeather("city", "key", fakeRequest(['{}'])));
});

test("escapes user-controlled HTML", () => {
  assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});
