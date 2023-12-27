const isCreatableMixin = {
}
const IsCreatable = {
  mixInto(klass) {
    if (klass.appendNewChild) {
      throw `${klass} already has appendNewChild defined`
    }
    Object.assign(klass.prototype,isCreatableMixin)
    klass.appendNewChild = (element,attributes) => {
      const newElement = document.createElement(klass.tagName)
      element.appendChild(newElement)
      for(const [attributeName, value] of Object.entries(attributes) ) {
        newElement.setAttribute(attributeName, value)
      }
      return newElement
    }
    klass.insertNewChildAfter = (element,after,attributes) => {
      const newElement = document.createElement(klass.tagName)
      const before = Array.from(element.children).find( (child, index, array) => {
        console.log("Checking %o against %o",array[index-1],after)
        return (array[index-1] == after) 
      })
      if ( (!before) && (element.children.length > 1) ) {
        throw `Cannot find a child element from ${element}`
      }
      if (!before) {
        element.appendChild(newElement)
      }
      else {
        element.insertBefore(newElement, before)
      }
      for(const [attributeName, value] of Object.entries(attributes) ) {
        newElement.setAttribute(attributeName, value)
      }
      return newElement
    }
  }

}

export default IsCreatable
