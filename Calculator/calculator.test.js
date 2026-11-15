const test = require("node:test");
const assert = require("node:assert/strict");
const app = require("./calculator");

test("calculator validates numeric inputs and BMI units", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.on("listening", resolve));
  const base = "http://127.0.0.1:" + server.address().port;
  const post = (path, values) => fetch(base + path, { method: "POST", body: new URLSearchParams(values) });
  try {
    const valid = await post("/", { num1: "-2.5", num2: "10" });
    assert.equal(valid.status, 200);
    assert.match(await valid.text(), /7\.5/);
    assert.equal((await post("/", { num1: "", num2: "10" })).status, 400);
    assert.equal((await post("/bmiCalculator", { weight: "70kg", height: "1.75" })).status, 400);
    assert.equal((await post("/bmiCalculator", { weight: "70", height: "0" })).status, 400);
    const bmi = await post("/bmiCalculator", { weight: "70", height: "1.75" });
    assert.equal(bmi.status, 200);
    assert.match(await bmi.text(), /22\.857/);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
