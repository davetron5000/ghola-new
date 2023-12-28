import Color from "../dataTypes/Color"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"

// XXX: This doesn't need to exist as a web component
class ColorSwatchInputComponent extends HTMLElement {
  static attributeListeners = {
    "value": {},
    "labelled-by": {},
    "editable": {
      klass: Boolean,
    }
  }

  static events = {
    valueChanged: {}
  }

  updateValue(hexCode) { this.setAttribute("value",hexCode) }
  clearValue() { this.removeAttribute("value") }

  setLabel($label) { this.setAttribute("labelled-by",$label.getAttribute("for")) }
  removeLabel($label) { this.removeAttribute("labelled-by") }

  afterAppendTemplate() {
    this.$element.addEventListener("change", (event) => {
      this.setAttribute("value", this.$element.value)
      this.dispatchValueChanged(this.$element.value)
    })
  }

  disconnectedCallback() {
    this.removeEventListeners()
  }

  render() {
    if (!this.$element) {
      return
    }
    if (this.labelledBy) {
      this.$element.setAttribute("id",this.labelledBy)
    }
    else {
      this.$element.removeAttribute("id")
    }
    if (this.value) {
      this.$element.value = this.value
      this.$element.setAttribute("value",this.value)
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
