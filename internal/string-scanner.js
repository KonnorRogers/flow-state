export class StringScanner {
  #input;
  #cursor;

  /**
   * @param {string} input
   */
  constructor(input) {
    /**
     * @type {string}
     */
    this.#input = input;

    /**
     * @type {number}
     */
    this.#cursor = 0;
  }

  get input() {
    return this.#input;
  }

  get currentCharacter() {
    return this.input[this.cursor];
  }

  /**
   * @return {number}
   */
  get cursor() {
    return this.#cursor;
  }

  /**
   * If cursor is at the end of the string
   */
  get done() {
    return this.cursor >= this.input.length;
  }

  /**
   * Returns the next character, or '' if done without advancing the cursor.
   *
   * @param {number} [distance=1]
   * @return {string} 1 or multiple characters depending on distance.
   */
  peek(distance = 1) {
    let str = "";

    for (let i = 1; i <= distance; i++) {
      str += this.input[this.cursor + i];
    }

    return str;
  }

  /**
   * Returns the next character[s], or '' if done. Advances the cursor.
   *
   * @param {number} [distance=1]
   * @return {string} characters or ''
   */
  pop(distance = 1) {
    let str = "";

    for (let i = 0; i < distance; i++) {
      str += this.input[this.#cursor];
      this.#cursor++;
    }

    return str;
  }

  /**
   * Returns the string match for `regex` starting
   * from the current cursor. Advances cursor if a
   * match is found. Returns `undefined` otherwise.
   *
   * @param {RegExp} regex
   * @return {string|undefined}
   * @throws {Error} given regex global flag not set
   */
  scan(regex) {
    if (!regex.global) {
      throw Error("regex global flag must be set");
    }

    regex.lastIndex = this.#cursor;
    const match = regex.exec(this.#input);

    if (match === null || match.index !== this.#cursor) {
      return undefined;
    }

    this.#cursor = regex.lastIndex;

    return match[0];
  }

  // ...
}
