import { LitElement } from "lit";
import { DefineableMixin } from "web-component-define";
import { version } from "./version.js";

/**
 * @customElement
 */
export class BaseElement extends DefineableMixin(LitElement) {
  /**
   * @type {Record<string, typeof BaseElement>}
   */
  static dependencies = {};

  static version = version;

  // /**
  //  * @param {string} [name=this.baseName] - Tag name
  //  * @param {CustomElementConstructor} [ctor=this] - Constructor to pass to define
  //  * @param {ElementDefinitionOptions} [additionalOptions]
  //  */
  // static define (name = this.baseName, ctor = this, additionalOptions) {
  //   if (customElements.get(name)) {
  //     return
  //   }

  //   customElements.define(name, ctor, additionalOptions)
  // }

  constructor() {
    super();
    Object.entries(
      /** @type {typeof BaseElement} */ (this.constructor).dependencies,
    ).forEach(([name, ctor]) => {
      ctor.define(name);
    });
  }

  /**
   * Gets directionality of the element
   * @returns {"ltr" | "rtl"}
   */
  getTextDirection() {
    return this.matches(":dir(rtl)") ? "rtl" : "ltr";
  }
}
