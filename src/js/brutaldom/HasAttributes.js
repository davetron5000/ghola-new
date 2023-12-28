import RichString from "./RichString"
const noop = () => {}

const hasAttributesMixin = {
  attributeChangedCallback(name, oldValue, newValue) {
    const valueChanged = oldValue !== newValue
    const attributeListeners = this.constructor.attributeListeners
    if (attributeListeners && attributeListeners[name]) {
      const attributeName = attributeListeners[name].attributeName || new RichString(name).camelize()
      const klass = attributeListeners[name].klass
      const debug = attributeListeners[name].debug || this.constructor.DEBUG_ATTRIBUTES
      if (debug) {
        console.log(`${this.constructor.name}: %s changed from %s to %s`,name,oldValue,newValue)
        console.log(`${this.constructor.name}: Using %o to set %s`,klass, attributeName)
      }
      if (klass) {
        if (klass === Boolean) {
          this[attributeName] = newValue === "true"
        }
        else {
          this[attributeName] = new klass(newValue)
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
