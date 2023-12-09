import HexCode from "../dataTypes/HexCode"

class ColorSwatchInputComponent extends HTMLElement {
  static observedAttributes = ["value", "labelled-by"];

  connectedCallback() {
    this._readTemplateIfNeeded()
    const node = this.templateContent.cloneNode(true)
    if (node.childElementCount != 1) {
      throw `<template> with id 'g-hexcode' has ${node.childElementCount} children, but must have exactly 1`
    }
    this.$element = node.firstElementChild
    this.appendChild(node)
    this.$element.addEventListener("input", (event) => {
      this.setAttribute("value", this.$element.value)
    })
    this._render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "value") {
      const newCode = new HexCode(newValue)
      this.hexCode = newCode
      this.dispatchEvent(new CustomEvent("valueChanged",{ detail: this.hexCode }))
    }
    if (name == "labelled-by") {
      this.$element.setAttribute("id",newValue)
    }
    this._render()
  }

  reset() {
    this.setAttribute("value", this.$element.getAttribute("value"))
  }

  onValueChanged(listener) {
    this.addEventListener("valueChanged", listener)
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.hexCode) {
      this.$element.value = this.hexCode.toString()
      if (!this.$element.getAttribute("value")) {
        this.$element.setAttribute("value",this.hexCode.toString())
      }
    }
    else {
      this.$element.textContent = ""
    }
  }

  _readTemplateIfNeeded() {
    if (this.templateContent) {
      return
    }
    const $template = document.getElementById("g-color-swatch-input")
    if (!$template) {
      throw `Expected to find template with id 'g-color-swatch-input' but none was found`
    }
    this.templateContent = $template.content
  }
  static define() {
    customElements.define("g-color-swatch-input", ColorSwatchInputComponent);
  }
}
export default ColorSwatchInputComponent
