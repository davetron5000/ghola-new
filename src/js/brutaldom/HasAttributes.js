const noop = () => {}
const camelCase = (string) => {
  // Take from camelize npm module
  return string.replace(/[_.-](\w|$)/g, function (_, x) {
    return x.toUpperCase();
  });
}

const hasAttributesMixin = {
  attributeChangedCallback(name, oldValue, newValue) {
    const attributeListeners = this.constructor.attributeListeners
    if (attributeListeners && attributeListeners[name]) {
      const attributeName = attributeListeners[name].attributeName || camelCase(name)
      console.log(attributeName)
      if (attributeListeners[name].klass) {
        this[attributeName] = new attributeListeners[name].klass(newValue)
      }
      else if (attributeListeners[name].value) {
        this[attributeName] = attributeListeners[name].value(newValue)
      }
      else {
        this[attributeName] = newValue
      }
    }
    this._render()
  }
}
const HasAttributes = {
  mixInto(klass) {
    if (!klass.observedAttributes || !klass.observedAttributes.length || klass.observedAttributes.length == 0) {
      throw `${klass.name} cannot use HasAttributes since it does not set observedAttributes`
    }
    Object.assign(klass.prototype,hasAttributesMixin)
  }

}

export default HasAttributes
