/**
 * Takes a {ParsedAction} object and properly binds and attaches.
 * @template {import("../internal/action-parser.js").ParsedAction} T
 */
export class Action {
  /**
   * @param {T} parsedAction
   */
  constructor(parsedAction) {
    this.parsedAction = parsedAction;
  }
}
