import HexCode from "../dataTypes/HexCode"
import HTMLId from "../dataTypes/HTMLId"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"

class EditableColorSwatchComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      value: HexCode,
    },
    "description": { },
    "editable": {
      value: (newValue) => newValue == "true",
    }
  }

  constructor() {
    super()
    this.editable = true
  }

  /*
   * Here is what SUUUCKS:
   *
   * - locating elements in the template that are supposed to be there
   * - rendering the template
   *   -> HasAttributes
   * - using slots without fucking shadow dom
   * - dealing with attributes
   *   -> HasAttributes (ish)
   * - handling stuff being there or not due to ordering of calls
   * - trying to use types but needing strings sometimes
   * - duplication of the custom element name in the code
   * - re-usable element with markup
   * - lots of fucking names
   * - connecting the events in a way that makes sense
   *
   */
  connectedCallback() {
    this.addNodeFromTemplate({
      childTagName: "form",
      before: ({element}) => {
        this.$input = element.querySelector("g-color-swatch-input")
        if (!this.$input) {
          throw `<template> is messed up: expected to find a <g-color-swatch-input> but did not`
        }
        this.$inputLabel = element.querySelector("label")
        if (!this.$inputLabel) {
          throw `<template> is messed up: expected to find a <label> but did not`
        }
        this.$hexCode = element.querySelector("g-hex-code")
        if (!this.$hexCode) {
          throw `<template> is messed up: expected to find a <g-hex-code> but did not`
        }
        this.$colorName = element.querySelector("g-color-name")
        if (!this.$colorName) {
          throw `<template> is messed up: expected to find a <g-color-color-name> but did not`
        }
        this.$resetButton = element.querySelector("g-reset-button")
        if (!this.$resetButton) {
          throw `<template> is messed up: expected to find a reset button but did not`
        }
      },
      after: ({element}) => {
        this.$input.onValueChanged( (event) => this.$hexCode.setAttribute("hex-code",event.detail.value) )
        this.$input.onValueChanged( (event) => this.$colorName.setAttribute("hex-code",event.detail.value) )
        this.$input.onValueChanged( (event) => {
          if (event.detail.isDefault) {
            this.$resetButton.disable()
          }
          else {
            this.$resetButton.enable()
          }
        })
        element.addEventListener("reset", (event) => {
          event.preventDefault()
          this.$input.reset()
        })
        element.addEventListener("submit", (event) =>  event.preventDefault() )
      },
    })
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.hexCode) {
      this.$input.setAttribute("value",this.hexCode)
      this.$hexCode.setAttribute("hex-code",this.hexCode)
      this.$colorName.setAttribute("hex-code",this.hexCode)
    }
    else {
      this.$input.removeAttribute("value")
      this.$hexCode.removeAttribute("hex-code")
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
    this.$input.editable = this.editable
    if (!this.editable) {
      this.$resetButton.hide()
    }
    else {
      this.$resetButton.show()
    }
  }

  onUserChange(listener) {
    this.$input.onValueChanged( (event) => listener(event) )
  }

  static define() {
    customElements.define(this.tagName, EditableColorSwatchComponent);
  }
  static tagName = "g-editable-color-swatch"
}
HasTemplate.mixInto(EditableColorSwatchComponent)
HasAttributes.mixInto(EditableColorSwatchComponent)
export default EditableColorSwatchComponent
