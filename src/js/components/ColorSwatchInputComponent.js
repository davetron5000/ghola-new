import HexCode from "../dataTypes/HexCode"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"

class ColorSwatchInputComponent extends HTMLElement {
  static observedAttributes = ["value", "labelled-by"];
  static attributeListeners = {
    "value": {
      attributeName: "hexCode",
      klass: HexCode,
    },
    "labelled-by": {
      attributeName: "labelledBy",
    }
  }

  connectedCallback() {
    this.addNodeFromTemplate({
      after: ({element}) => {
        element.addEventListener("input", (event) => {
          this.setAttribute("value", element.value)
        })
      }
    })
  }

  set hexCode(newHexCode) {
    this._hexCode = newHexCode
    this.dispatchEvent(new CustomEvent("valueChanged",{ detail: newHexCode }))
  }
  get hexCode() {
    return this._hexCode
  }

  set labelledBy(newLabelledBy) {
    this.$element.setAttribute("id",newLabelledBy)
  }

  set editable(newValue) {
    if (newValue) {
      this.$element.removeAttribute("disabled")
    }
    else {
      this.$element.setAttribute("disabled",true)
    }
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

  static tagName = "g-color-swatch-input"
  static define() {
    customElements.define(this.tagName, ColorSwatchInputComponent);
  }
}
HasTemplate.mixInto(ColorSwatchInputComponent)
HasAttributes.mixInto(ColorSwatchInputComponent)
export default ColorSwatchInputComponent
