const noop = () => {}

const hasTemplateMixin = {
  addNodeFromTemplate({ childTagName, before = noop, after = noop, render = true} = {}) {
    const node = this._newNodeFromTemplate()
    this.$element = node.firstElementChild

    before({ element: this.$element })

    this.appendChild(node)

    after({ element: this.$element })

    if (render) {
      this._render()
    }
  },
  _newNodeFromTemplate({ childTagName } = {}) {
    if (!this.templateContent) {
      const $template = document.getElementById(this.constructor.tagName)
      if (!$template) {
        throw `Expected to find template with id '${this.constructor.tagName}' but none was found`
      }
      this.templateContent = $template.content
    }
    const node = this.templateContent.cloneNode(true)
    if (node.childElementCount != 1) {
      throw `<template> with id '${this.constructor.tagName}' has ${node.childElementCount} children, but must have exactly 1`
    }
    if (childTagName) {
      childTagName = childTagName.toUpperCase()
      if (node.firstElementChild.tagName != childTagName) {
        throw `<template> with id '${this.constructor.tagName}' is missed up - should be a <${childTagName}>, but is a <${node.firstElementChild.tagName}>`
      }
    }
    return node
  }
}
const HasTemplate = {
  mixInto(klass) {
    if (!klass.tagName) {
      throw `${klass.name} cannot be mixed into HasTemplate since it doesn't have a static member 'tagName'`
    }
    Object.assign(klass.prototype,hasTemplateMixin)
  }
}

export default HasTemplate
