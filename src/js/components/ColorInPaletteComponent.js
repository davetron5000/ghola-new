import HexCode from "../dataTypes/HexCode"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"

class ColorInPaletteComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      value: HexCode,
    },
    "primary": {
      value: (x) => x === "true"
    }
  }

  static events = {
    "removed": {},
    "changed": {},
  }

  connectedCallback() {
    this.addNodeFromTemplate({
      before: ({element}) => {
        this.$colorScale = element.querySelector("g-color-scale")
        if (!this.$colorScale) {
          throw `<template> is messed up - expected a <g-color-scale>`
        }
        this.$removeButton = element.querySelector("button[data-remove]")
        if (!this.$removeButton) {
          throw `<template> is messed up - expected a <button data-remove>`
        }
      },
      after: () => {
        this.$colorScale.onBaseColorChange( (event) => this.dispatchChanged(event.detail) )
        this.$removeButton.addEventListener("click", (event) => {
          event.preventDefault()
          this.dispatchRemoved(event.detail)
        })
      }
    })
  }

  disconnectedCallback() {
    this.removeEventListeners()
    this.$removeButton.removeEventListener("click", this.removeButtonClickListener)
  }
  
  _render() {
    if (!this.$element) {
      return
    }
    if (this.hexCode) {
      this.$colorScale.setAttribute("hex-code", this.hexCode.toString())
    }
    if (this.primary) {
      this.$removeButton.style.visibility = "hidden"
    }
    else {
      this.$removeButton.style.visibility = "visible"
    }
  }

  static tagName = "g-color-in-palette"
  static define() {
    customElements.define(this.tagName, ColorInPaletteComponent);
  }
}
HasTemplate.mixInto(ColorInPaletteComponent)
HasAttributes.mixInto(ColorInPaletteComponent)
HasEvents.mixInto(ColorInPaletteComponent)
export default ColorInPaletteComponent
