const hasRequiredChildElementsMixin = {
}
const HasRequiredChildElements = {
  mixInto(klass) {
    Object.assign(klass.prototype,hasRequiredChildElementsMixin)
  }

}

export default HasRequiredChildElements
