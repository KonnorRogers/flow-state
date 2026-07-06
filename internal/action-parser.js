import { StringScanner } from "./string-scanner.js";

/**
 * @typedef {object} ParsedAction
 * @property {string} controllerName - The name of the controller
 * @property {string} controllerFunction - The function to call
 * @property {string} eventName - The name of the event to trigger on
 * @property {string} eventModifier - The name of the event to trigger on
 * @property {Array<string>} additionalEventModifiers - additional event modifiers such as "ctrl", "alt", "shift", etc.
 * @property {Array<string>} actionOptions - Additional options IE: capture, passive, etc. https://stimulus.hotwired.dev/reference/actions#options.
 * @property {undefined | null | string} globalTarget - The target, IE: `@window`, `@document`.
 * @property {false | string} error - If there was an error parsing, it'll live here.
 */

/**
 * @typedef {object} EventTokens
 * @property {string} eventName - The name of the event
 * @property {string} eventModifier - IE: "a", "b", "c", etc.
 * @property {Array<string>} additionalEventModifiers - IE: "ctrl+", "shift+"
 */

/**
 * The class in charge of parsing an action
 */
export class ActionParser {
  /**
   * @param {string} input
   */
  constructor(input) {
    /**
     * @type {string}
     */
    this.input = input;
  }

  /**
   * At minimum, an action needs an eventName, controllerFunction, and controllerName
   */
  static NoEventNameError = "No event name found";
  static NoControllerFunctionError = "No controller function name found";
  static NoControllerNameError = "No controller name found";

  /**
   * @return {ParsedAction}
   */
  parse() {
    /**
     * @type {ParsedAction}
     */
    const obj = {
      eventName: "",
      eventModifier: "",
      additionalEventModifiers: [],
      globalTarget: "",
      controllerName: "",
      controllerFunction: "",
      actionOptions: [],
      error: false,
    };

    const scanner = new StringScanner(this.input);

    const ctor = /** @type {typeof ActionParser} */ (this.constructor);

    // The order of the following parsers matters.
    let { eventName, eventModifier, additionalEventModifiers } =
      this.parseEvent(scanner);

    if (!eventName) {
      /**
       * No event name found. No-op here and let it fail validation.
       */
      obj.error = ctor.NoEventNameError;
      return obj;
    }

    obj.eventName = eventName;
    obj.eventModifier = eventModifier;
    obj.additionalEventModifiers = additionalEventModifiers;

    /**
     * Not all actions have targets. But, let's check anyways.
     */
    const globalTarget = this.findGlobalTarget(scanner);

    if (globalTarget) {
      obj.globalTarget = globalTarget;
    }

    // Puts us at either "->" or "@"
    const controllerName = this.findControllerName(scanner);

    // If controllerName is empty, we no-op because the syntax is probably wrong.
    if (!controllerName) {
      obj.error = ctor.NoControllerNameError;
      return obj;
    }

    obj.controllerName = controllerName;

    const controllerFunction = this.findControllerFunction(scanner);

    if (!controllerFunction) {
      /**
       * No controller function found. No-op here and let it fail validation.
       */

      obj.error = ctor.NoControllerFunctionError;
      return obj;
    }

    obj.controllerFunction = controllerFunction;

    const actionOptions = this.findActionOptions(scanner);

    obj.actionOptions = actionOptions;

    return obj;
  }

  /**
   * Finds all `actionOptions`, IE: ":!passive", ":!capture", etc
   * @param {StringScanner} scanner
   * @return {Array<string>}
   */
  findActionOptions(scanner) {
    /**
     * @type {Array<string>}
     */
    let actionOptions = [];

    while (!scanner.done) {
      const action = this.findActionOption(scanner);
      actionOptions.push(action);

      if (action === "") {
        return actionOptions;
      }
    }

    return actionOptions;
  }

  /**
   * Finds an `actionOption`, IE: ":!passive", ":!capture", etc
   * @param {StringScanner} scanner
   * @return {string}
   */
  findActionOption(scanner) {
    let actionOption = "";

    if (scanner.currentCharacter !== ":") {
      return actionOption;
    }

    // Remove the ":"
    scanner.pop();

    while (!scanner.done) {
      if (scanner.peek() === ":") {
        actionOption += scanner.pop();
        return actionOption;
      }

      actionOption += scanner.pop();
    }

    return actionOption;
  }

  /**
   * Finds the `controllerFunction`, IE: "doThing", "doOtherThing", etc
   * @param {StringScanner} scanner
   * @return {string}
   */
  findControllerFunction(scanner) {
    let controllerFunction = "";

    if (scanner.currentCharacter !== "#") {
      return controllerFunction;
    }

    scanner.pop();

    while (!scanner.done) {
      if (scanner.peek() === ":") {
        controllerFunction += scanner.pop();
        return controllerFunction;
      }

      controllerFunction += scanner.pop();
    }

    return controllerFunction;
  }

  /**
   * Finds the `controllerName`, IE: "my-controller"
   * @param {StringScanner} scanner
   * @return {string}
   */
  findControllerName(scanner) {
    let controllerName = "";

    if (scanner.currentCharacter + scanner.peek() !== "->") {
      return controllerName;
    }

    // Remove the "->"
    scanner.pop(2);

    while (!scanner.done) {
      if (scanner.peek() === "#") {
        controllerName += scanner.pop();
        return controllerName;
      }

      controllerName += scanner.pop();
    }

    return controllerName;
  }

  /**
   * Finds the `globalTarget`. Either `@window` or `@document` usually.
   * @param {StringScanner} scanner
   * @return {string}
   */
  findGlobalTarget(scanner) {
    let globalTarget = "";

    if (scanner.currentCharacter !== "@") {
      return globalTarget;
    }

    // Remove the "@"
    scanner.pop();

    while (!scanner.done) {
      if (scanner.peek(2) === "->") {
        globalTarget += scanner.pop();
        return globalTarget;
      }

      globalTarget += scanner.pop();
    }

    return globalTarget;
  }

  /**
   * Finds the `eventName`, IE: "click", "scroll", etc
   * @param {StringScanner} scanner
   * @return {EventTokens}
   */
  parseEvent(scanner) {
    let parsedStr = "";

    while (!scanner.done) {
      if (scanner.peek() === "@" || scanner.peek(2) === "->") {
        parsedStr += scanner.pop();
        break;
      }
      parsedStr += scanner.pop();
    }

    const splitStr = parsedStr.split(/\./);
    const eventName = splitStr[0];
    const modifiers = (splitStr[1] || "").split(/\+/);

    /**
     * @type Array<string>
     */
    const additionalEventModifiers = [];

    // Remove the last modifier which is the original "modifier"
    const eventModifier = modifiers.pop() || "";

    // Find additionalEventModifiers
    if (modifiers.length > 0) {
      modifiers.forEach((modifier) => additionalEventModifiers.push(modifier));
    }

    return {
      eventName,
      eventModifier,
      additionalEventModifiers,
    };
  }
}
