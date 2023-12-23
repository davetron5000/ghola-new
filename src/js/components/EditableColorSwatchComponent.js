import HexCode from "../dataTypes/HexCode"
import HTMLId from "../dataTypes/HTMLId"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"

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

  static events = {
    hexCodeChanged: {},
  }

  constructor() {
    super()
    this.editable = true
  }

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
      },
      after: ({element}) => {
        this.$input.onHexCodeChanged( (event) => this.$hexCode.setAttribute("hex-code",event.detail.toString()) )
        this.$input.onHexCodeChanged( (event) => this.$colorName.setAttribute("hex-code",event.detail.toString()) )
        this.$input.onHexCodeChanged( (event) => this.dispatchHexCodeChanged(event.detail) )
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
  }

  static define() {
    customElements.define(this.tagName, EditableColorSwatchComponent);
  }
  static tagName = "g-editable-color-swatch"
}
HasTemplate.mixInto(EditableColorSwatchComponent)
HasAttributes.mixInto(EditableColorSwatchComponent)
HasEvents.mixInto(EditableColorSwatchComponent)
export default EditableColorSwatchComponent
