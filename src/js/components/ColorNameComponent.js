import ColorName from "../dataTypes/ColorName"

class ColorNameComponent extends HTMLElement {
  static observedAttributes = ["hex-code"];

  connectedCallback() {
    this._readTemplateIfNeeded()
    const node = this.templateContent.cloneNode(true)
    if (node.childElementCount != 1) {
      throw `<template> with id 'g-color-name' has ${node.childElementCount} children, but must have exactly 1`
    }
    this.$element = node.firstElementChild
    this.$nameSlot = this.$element.querySelector("slot[name='name']")
    if (!this.$nameSlot) {
      throw `<template> is messed up - expected a <slot name='name'> but did not find one`
    }

    this.appendChild(node)
    this._render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "hex-code") {
      this.colorName = new ColorName(newValue)
    }
    this._render()
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.colorName) {
      this.$nameSlot.textContent = this.colorName
    }
    else {
      this.$nameSlot.textContent = ""
    }
  }

  _readTemplateIfNeeded() {
    if (this.templateContent) {
      return
    }
    const $template = document.getElementById("g-color-name")
    if (!$template) {
      throw `Expected to find template with id 'g-color-name' but none was found`
    }
    this.templateContent = $template.content
  }
  static define() {
    customElements.define("g-color-name", ColorNameComponent);
  }
}
export default ColorNameComponent
