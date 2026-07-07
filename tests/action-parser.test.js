// @ts-check

import { assert } from "@esm-bundle/chai";
import { ActionParser } from "../internal/action-parser.js";
/**
 * Example strings:

[eventName][?@target]->[controllerName]:[additionalDescriptors]
scroll->gallery#layout:!passive
click->gallery#open:capture
resize@window->gallery#layout
keydown.esc->modal#close
keydown.ctrl+esc->modal#close
my-thing->my-gallery#my-function
my-thing->my-gallery#my_function
 */
test("Should properly parse actions 1", () => {
  let action = "scroll->gallery#layout:!passive";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.eventName, "scroll");
  assert.equal(obj.eventModifier, null);
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.controllerName, "gallery");
  assert.equal(obj.controllerFunction, "layout");
  assert.equal(obj.globalTarget, null);
  assert.equal(obj.actionOptions.length, 1);
  assert.equal(obj.actionOptions[0], "!passive");
});

test("Should properly parse actions 2", () => {
  let action = "click->gallery--details#open:!capture:passive";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.eventName, "click");
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.eventModifier, null);
  assert.equal(obj.controllerName, "gallery--details");
  assert.equal(obj.controllerFunction, "open");
  assert.equal(obj.globalTarget, null);
  assert.equal(obj.actionOptions.length, 2);
  assert.equal(obj.actionOptions[0], "!capture");
  assert.equal(obj.actionOptions[1], "passive");
});

test("Should properly parse actions 3", () => {
  let action = "resize@window->gallery#layout";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.eventName, "resize");
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.eventModifier, null);
  assert.equal(obj.controllerName, "gallery");
  assert.equal(obj.controllerFunction, "layout");
  assert.equal(obj.globalTarget, "window");
  assert.equal(obj.actionOptions.length, 0);
});

test("Should properly parse actions 4", () => {
  let action = "my:custom-event@window->gallery#layout";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.eventName, "my:custom-event");
  assert.equal(obj.eventModifier, null);
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.controllerName, "gallery");
  assert.equal(obj.controllerFunction, "layout");
  assert.equal(obj.globalTarget, "window");
  assert.equal(obj.actionOptions.length, 0);
});

test("Should properly parse actions 5", () => {
  let action = "my-thing->my-gallery#my_function";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.eventName, "my-thing");
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.eventModifier, null)
  assert.equal(obj.controllerName, "my-gallery");
  assert.equal(obj.controllerFunction, "my_function");
  assert.equal(obj.globalTarget, null);
  assert.equal(obj.actionOptions.length, 0);
});

test("Should properly parse key modifiers", () => {
  let action = "keydown.esc->my-gallery#my_function";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.eventName, "keydown");
  assert.equal(obj.eventModifier, "esc");
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.controllerName, "my-gallery");
  assert.equal(obj.controllerFunction, "my_function");
  assert.equal(obj.globalTarget, null);
  assert.equal(obj.actionOptions.length, 0);
});

test("Should properly parse additional event modifiers", () => {
  let action = "keydown.shift+ctrl+esc->my-gallery#my_function";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.eventName, "keydown");
  assert.equal(obj.eventModifier, "esc");
  assert.equal(obj.additionalEventModifiers.length, 2);
  assert.equal(obj.additionalEventModifiers[0], "shift");
  assert.equal(obj.additionalEventModifiers[1], "ctrl");
  assert.equal(obj.controllerName, "my-gallery");
  assert.equal(obj.controllerFunction, "my_function");
  assert.equal(obj.globalTarget, null);
  assert.equal(obj.actionOptions.length, 0);
});

test("falls back to global controller", () => {
  let action = "keydownescmy-gallery#my_function";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.eventName, "keydownescmy-gallery");
  assert.equal(obj.eventModifier, null);
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.controllerName, "global");
  assert.equal(obj.controllerFunction, "my_function");
  assert.equal(obj.globalTarget, null);
  assert.equal(obj.errors.length, 0);
  assert.equal(obj.actionOptions.length, 0);
});

test("No event name found", () => {
  let action = "";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.errors[0], ActionParser.NoEventNameError);
  assert.equal(obj.eventName, null);
  assert.equal(obj.eventModifier, null);
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.controllerName, null);
  assert.equal(obj.controllerFunction, null);
  assert.equal(obj.globalTarget, null);
  assert.equal(obj.actionOptions.length, 0);
});

test("No function name found", () => {
  let action = "keydown.esc->my-gallerymy_function";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.errors[0], ActionParser.NoControllerFunctionError);
  assert.equal(obj.eventName, "keydown");
  assert.equal(obj.eventModifier, "esc");
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.controllerName, "my-gallerymy_function");
  assert.equal(obj.controllerFunction, null);
  assert.equal(obj.globalTarget, null);
  assert.equal(obj.actionOptions.length, 0);
});

test("Omitted controller defaults to global controllerName", () => {
  let action = "click#increment";

  const obj = new ActionParser(action).parse();

  assert.equal(obj.errors.length, 0);
  assert.equal(obj.eventName, "click");
  assert.equal(obj.eventModifier, null);
  assert.equal(obj.additionalEventModifiers.length, 0);
  assert.equal(obj.controllerName, "global");
  assert.equal(obj.controllerFunction, "increment");
  assert.equal(obj.globalTarget, null)
  assert.equal(obj.actionOptions.length, 0);
});
