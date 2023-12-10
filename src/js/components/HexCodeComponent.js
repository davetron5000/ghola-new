import HexCode from "../dataTypes/HexCode"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"

class HexCodeComponent extends HTMLElement {
  static observedAttributes = ["hex-code"];
  static attributeListeners = {
    "hex-code": {
      klass: HexCode,
    }
  }

  connectedCallback() {
    this.addNodeFromTemplate({
      before: ({element}) => {
        this.$codeSlot = element.querySelector("slot[name='code']")
        if (!this.$codeSlot) {
          throw `<template> is messed up - expected a <slot name='code'> but did not find one`
        }
      }
    })
  }

  _render() {
    if (!this.$element) {
      return
    }
    console.log(this.hexCode)
    if (this.hexCode) {
      this.$codeSlot.textContent = this.hexCode
    }
    else {
      this.$codeSlot.textContent = ""
    }
  }

  static tagName = "g-hex-code"
  static define() {
    customElements.define(this.tagName, HexCodeComponent);
  }
}
HasTemplate.mixInto(HexCodeComponent)
HasAttributes.mixInto(HexCodeComponent)
export default HexCodeComponent
