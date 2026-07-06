/**
 * The base class for creating oil controllers.
 */
export class Controller {
  /**
   * @type {string[]}
   */
  static targets = [];

  /**
   * @type {string | null | undefined}
   */
  static controllerName;

  static __finalized__ = false;

  /**
   * @param {object} options
   * @param {HTMLElement} options.element
   * @param {import("./application.js").Application} options.application
   * @param {string} options.controllerName
   */
  constructor({ element, application, controllerName }) {
    /** @type {typeof Controller} */ (this.constructor).targets.forEach(
      (targetName) => {
        const ctor = /** @type {typeof Controller} */ (this.constructor);
        // Make sure target calls are accessible in the constructor.
        if (!ctor.__finalized__) {
          ctor.__finalized__ = true;

          Object.defineProperties(ctor.prototype, {
            [`${targetName}Targets`]: {
              get() {
                /**
                 * @type {HTMLElement[]}
                 */
                const ary = [];
                /** @type {NodeListOf<HTMLElement>} */ (
                  this.element.querySelectorAll(
                    this.application._targetQuery(
                      this.controllerName,
                      targetName,
                    ),
                  )
                ).forEach((el) => {
                  if (
                    el.closest(
                      this.application._controllerQuery(this.controllerName),
                    ) !== this.element
                  ) {
                    return;
                  }

                  ary.push(el);
                });

                return ary;
              },
            },
            [`has${capitalize(targetName)}Target`]: {
              get() {
                return Boolean(this[`${targetName}Target`]);
              },
            },
            [`${targetName}Target`]: {
              get() {
                return this[`${targetName}Targets`]?.[0] || null;
              },
            },
          });
        }
      },
    );

    /**
     * @type {Element}
     */
    this.element = element;

    /**
     * @type {import("./application.js").Application}
     */
    this.application = application;

    /**
     * @type {string}
     */
    this.controllerName = controllerName;

    /**
     * @type {boolean}
     */
    this.isConnected = false;
  }

  initialize() {}
  connectedCallback() {}
  disconnectedCallback() {}
}

/**
 * @param {string} str
 * @return {string}
 */
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1, str.length);
}
