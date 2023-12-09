import HexCode from "../dataTypes/HexCode"

class HexCodeComponent extends HTMLElement {
  static observedAttributes = ["code"];

  connectedCallback() {
    this._readTemplateIfNeeded()
    const node = this.templateContent.cloneNode(true)
    if (node.childElementCount != 1) {
      throw `<template> with id 'g-hexcode' has ${node.childElementCount} children, but must have exactly 1`
    }
    this.$element = node.firstElementChild
    this.$codeSlot = this.$element.querySelector("slot[name='code']")
    if (!this.$codeSlot) {
      throw `<template> is messed up - expected a <slot name='code'> but did not find one`
    }

    this.appendChild(node)
    this._render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "code") {
      const newCode = new HexCode(newValue)
      this.hexCode = newCode
    }
    this._render()
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.hexCode) {
      this.$codeSlot.textContent = this.hexCode
    }
    else {
      this.$codeSlot.textContent = ""
    }
  }

  _readTemplateIfNeeded() {
    if (this.templateContent) {
      return
    }
    const $template = document.getElementById("g-hexcode")
    if (!$template) {
      throw `Expected to find template with id 'g-hexcode' but none was found`
    }
    this.templateContent = $template.content
  }
  static define() {
    customElements.define("g-hexcode", HexCodeComponent);
  }
}
export default HexCodeComponent
