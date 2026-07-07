export const globalBus = new EventTarget()
/**
 * @template [T=unknown]
 * @param {T} val
 */
export function reactive (val) {
  return new State(val, globalBus)
}

class StateChangeEvent extends Event {
  /**
   * @param {string} name
   * @param {EventInit & { oldValue: unknown, newValue: unknown }} [init]
   */
  constructor(name, init) {
    super(name, init)

    if (init) {
      this.oldValue = init.oldValue
      this.oldValue = init.newValue
    }
  }
}


/**
 * @template [T=unknown]
 */
class State {
  /**
    * @param {T} value
    * @param {EventTarget} eventTarget
    */
  constructor (value, eventTarget) {
    /**
     * @type {T}
     */
    this._value = value
    this.eventTarget = eventTarget
  }

  get valueOf () {
    return this.value
  }

  get value () {
    return this.value
  }

  /**
    * @param {T} val
    * @returns {T}
    */
  set value (val) {
    if (this._value !== val) {
      this.eventTarget.dispatchEvent(new StateChangeEvent("change", {oldValue: this._value, newValue: val}))
    }
    this._value = val
  }
}
