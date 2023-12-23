const noop = () => {}
const camelCase = (string) => {
  // Take from camelize npm module
  return string.replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
}

const hasAttributesMixin = {
  attributeChangedCallback(name, oldValue, newValue) {
    const valueChanged = oldValue !== newValue
    const attributeListeners = this.constructor.attributeListeners
    if (attributeListeners && attributeListeners[name]) {
      const attributeName = attributeListeners[name].attributeName || camelCase(name)
      const value = attributeListeners[name].value
      const debug = attributeListeners[name].debug
      if (debug) {
        console.log("HasAttributes: %s changed from %s to %s",name,oldValue,newValue)
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
              console.error(e2)
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
      this._render()
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
