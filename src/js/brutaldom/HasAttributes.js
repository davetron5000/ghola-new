import RichString from "./RichString"
const noop = () => {}

const hasAttributesMixin = {
  attributeChangedCallback(name, oldValue, newValue) {
    const valueChanged = oldValue !== newValue
    const attributeListeners = this.constructor.attributeListeners
    if (attributeListeners && attributeListeners[name]) {
      const attributeName = attributeListeners[name].attributeName || new RichString(name).camelize()
      const value = attributeListeners[name].value
      const debug = attributeListeners[name].debug || this.constructor.DEBUG_ATTRIBUTES
      if (debug) {
        console.log(`${this.constructor.name}: %s changed from %s to %s`,name,oldValue,newValue)
      }
      if (value && typeof(value) === "function") {
        try {
          this[attributeName] = value(newValue)
        }
        catch (e) {
          if (e instanceof TypeError) {
            try {
              this[attributeName] = new value(newValue)
            }
            catch (e2) {
              console.error("After attempting to call %o as a function and then calling new on it, got %o",value,e2)
              throw e
            }
          }
          else {
            throw e
          }
        }
      }
      else {
        this[attributeName] = newValue
      }
    }
    if (valueChanged) {
      if (this.render) {
        this.render()
      }
    }
  }
}
const HasAttributes = {
  mixInto(klass) {
    if (!klass.observedAttributes || !klass.observedAttributes.length || klass.observedAttributes.length == 0) {
      klass.observedAttributes = Object.keys(klass.attributeListeners)
    }
    Object.assign(klass.prototype,hasAttributesMixin)
  }

}

export default HasAttributes
