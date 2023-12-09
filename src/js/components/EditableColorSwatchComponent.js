import HexCode from "../dataTypes/HexCode"
import HTMLId from "../dataTypes/HTMLId"

class EditableColorSwatchComponent extends HTMLElement {
  static observedAttributes = ["hex-code", "description"];

  /*
   * Here is what SUUUCKS:
   *
   * - locating elements in the template that are supposed to be there
   * - rendering the template
   * - using slots without fucking shadow dom
   * - dealing with attributes
   * - handling stuff being there or not due to ordering of calls
   * - trying to use types but needing strings sometimes
   * - duplication of the custom element name in the code
   *
   */
  connectedCallback() {
    this._readTemplateIfNeeded()
    const node = this.templateContent.cloneNode(true)
    if (node.childElementCount != 1) {
      throw `<template> with id 'g-hexcode' has ${node.childElementCount} children, but must have exactly 1`
    }
    this.$element = node.firstElementChild
    if (this.$element.tagName != "FORM") {
      throw `<template> with id 'g-hexcode' is missed up - should be a <FORM>, but is a <${this.$element.tagName}>`
    }
    this.$input = this.$element.querySelector("g-color-swatch-input")
    if (!this.$input) {
      throw `<template> is messed up: expected to find a <g-color-swatch-input> but did not`
    }
    this.$inputLabel = this.$element.querySelector("label")
    if (!this.$inputLabel) {
      throw `<template> is messed up: expected to find a <label> but did not`
    }
    this.$hexCode = this.$element.querySelector("g-hexcode")
    if (!this.$hexCode) {
      throw `<template> is messed up: expected to find a <g-color-hexcode> but did not`
    }
    this.$colorName = this.$element.querySelector("g-color-name")
    if (!this.$colorName) {
      throw `<template> is messed up: expected to find a <g-color-color-name> but did not`
    }
    this.$resetButton = this.$element.querySelector("input[type='reset']")
    if (!this.$resetButton) {
      throw `<template> is messed up: expected to find a reset button but did not`
    }
    this.appendChild(node)

    this.$input.onValueChanged( (event) => this.$hexCode.setAttribute("code",event.detail) )
    this.$input.onValueChanged( (event) => this.$colorName.setAttribute("hex-code",event.detail) )
    this.$input.onValueChanged( (event) => {
      if (event.detail.toString() == this.$input.getAttribute("value")) {
        this.$resetButton.setAttribute("disabled",true)
      }
      else {
        this.$resetButton.removeAttribute("disabled")
      }
    })
    this.$element.addEventListener("reset", (event) => {
      event.preventDefault()
      this.$input.reset()
    })
    this._render()
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "hex-code") {
      const newCode = new HexCode(newValue)
      this.hexCode = newCode
    }
    if (name == "description") {
      this.description = newValue
    }
    this._render()
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.hexCode) {
      this.$input.setAttribute("value",this.hexCode)
      this.$hexCode.setAttribute("code",this.hexCode)
      this.$colorName.setAttribute("hex-code",this.hexCode)
    }
    else {
      this.$input.removeAttribute("value")
      this.$hexCode.removeAttribute("code")
      this.$colorName.removeAttribute("hex-code")
    }
    if (this.description) {
      const id = HTMLId.fromString(this.description, { prefix: "color-swatch" })
      this.$input.setAttribute("labelled-by",id.toString())
      this.$inputLabel.setAttribute("for",id.toString())
      this.$inputLabel.textContent = `Choose color for ${this.description}`
    }
    else {
      this.$input.removeAttribute("labelled-by")
      this.$inputLabel.removeAttribute("for")
      this.$inputLabel.textContent = ""
    }
  }

  _readTemplateIfNeeded() {
    if (this.templateContent) {
      return
    }
    const $template = document.getElementById("g-editable-color-swatch")
    if (!$template) {
      throw `Expected to find template with id 'g-editable-color-swatch' but none was found`
    }
    this.templateContent = $template.content
  }
  static define() {
    customElements.define("g-editable-color-swatch", EditableColorSwatchComponent);
  }
}
export default EditableColorSwatchComponent
