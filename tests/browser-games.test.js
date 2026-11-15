const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("drum kit ignores unrelated keys and kick does not also play crash", () => {
  const sounds = [];
  const document = {
    querySelectorAll: () => [],
    querySelector: () => ({ classList: { add() {}, remove() {} } }),
    addEventListener() {}
  };
  const context = vm.createContext({ document, console, setTimeout: callback => callback(), Audio: function (file) { this.play = () => sounds.push(file); } });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../Drum Kit/index.js"), "utf8"), context);
  context.makeSound("k");
  assert.deepEqual(sounds, ["sounds/kick-bass.mp3"]);
  assert.doesNotThrow(() => { context.makeSound("Shift"); context.buttonAnimation("["); });
});

test("Simon ignores idle clicks and further input while advancing a completed round", () => {
  const handlers = {};
  const timers = new Map();
  let nextTimer = 0;
  const document = {};
  const fakeMath = Object.create(Math);
  fakeMath.random = () => 0;
  const $ = target => ({
    keypress(callback) { handlers.start = callback; },
    click(callback) { handlers.click = callback; },
    attr() { return target.id; },
    text() {}, addClass() {}, removeClass() {},
    fadeIn() { return this; }, fadeOut() { return this; }
  });
  const context = vm.createContext({
    $, document, Math: fakeMath,
    Audio: function () { this.play = () => {}; },
    setTimeout(callback) { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout(id) { timers.delete(id); }
  });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../Simon Game/game.js"), "utf8"), context);
  handlers.click.call({ id: "green" });
  assert.equal(context.userClickedPattern.length, 0);
  handlers.start();
  handlers.click.call({ id: "red" });
  const pending = context.nextSequenceTimer;
  assert.ok(pending);
  handlers.click.call({ id: "green" });
  assert.equal(context.userClickedPattern.length, 1);
  context.startOver();
  assert.equal(timers.has(pending), false);
  assert.equal(context.started, false);
});
