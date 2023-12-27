import HexCode from "../dataTypes/HexCode"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"

class ColorSwatchInputComponent extends HTMLElement {
  static attributeListeners = {
    "value": {
      attributeName: "hexCode",
      value: HexCode,
    },
    "labelled-by": {},
    "editable": {
      value: (x) => x == "true",
    }
  }

  static events = {
    hexCodeChanged: {}
  }

  updateValue(hexCode) { this.setAttribute("value",hexCode.toString()) }
  clearValue() { this.removeAttribute("value") }

  setLabel($label) { this.setAttribute("labelled-by",$label.getAttribute("for")) }
  removeLabel($label) { this.removeAttribute("labelled-by") }

  connectedCallback() {
    this.addNodeFromTemplate({
      after: ({element}) => {
        element.addEventListener("change", (event) => {
          this.setAttribute("value", element.value)
          this.dispatchHexCodeChanged(HexCode.fromString(element.value))
        })
      }
    })
  }

  disconnectedCallback() {
    this.removeEventListeners()
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.labelledBy) {
      this.$element.setAttribute("id",this.labelledBy)
    }
    else {
      this.$element.removeAttribute("id")
    }
    if (this.hexCode) {
      this.$element.value = this.hexCode.toString()
      this.$element.setAttribute("value",this.hexCode.toString())
    }
    else {
      this.$element.textContent = ""
    }
    if (this.editable) {
      this.$element.removeAttribute("disabled")
    }
    else {
      this.$element.setAttribute("disabled",true)
    }
  }

  static tagName = "g-color-swatch-input"
  static define() {
    customElements.define(this.tagName, ColorSwatchInputComponent);
  }
}
HasTemplate.mixInto(ColorSwatchInputComponent)
HasAttributes.mixInto(ColorSwatchInputComponent)
HasEvents.mixInto(ColorSwatchInputComponent)
export default ColorSwatchInputComponent
