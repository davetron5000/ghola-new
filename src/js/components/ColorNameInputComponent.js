import Color         from "../dataTypes/Color"
import HasTemplate   from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents     from "../brutaldom/HasEvents"
import Input         from "./Input"

class ColorNameInputComponent extends HTMLElement {
  static attributeListeners = {
    "name": {
    },
    "edited": {
      klass: Boolean,
    }
  }
  static events = {
    edited: {},
    cleared: {},
  }

  afterAppendTemplate({locator}) {
    this.$input = Input.wrap(locator.$e("input[name=colorName]"))
    this.inputCSSWhenDerived = String(this.$input.dataset.cssWhenDerived).split(" ")
    this.inputCSSWhenEdited = String(this.$input.dataset.cssWhenEdited).split(" ")
    this.$labelWhenDerived = locator.$e("[data-when-derived]")
    this.$labelWhenEdited = locator.$e("[data-when-edited]")
    this.$input.addEventListener("change", (event) => {
      if (event.target.value == "") {
        this.dispatchCleared()
      }
      else {
        this.dispatchEdited(event.target.value)
      }
    })
  }

  render() {
    if (!this.$element) {
      return
    }
    if (this.edited) {
      this.$labelWhenEdited.style.display  = "inline"
      this.$labelWhenDerived.style.display = "none"
      this.$input.classList.add(...this.inputCSSWhenEdited)
      this.$input.classList.remove(...this.inputCSSWhenDerived)
    }
    else {
      this.$labelWhenEdited.style.display  = "none"
      this.$labelWhenDerived.style.display = "inline"
      this.$input.classList.remove(...this.inputCSSWhenEdited)
      this.$input.classList.add(...this.inputCSSWhenDerived)
    }
    if (this.name) {
      this.$input.value = this.name
    }
  }

  setEditedValue(value) {
    this.setAttribute("name", value)
    this.setAttribute("edited",true)
  }
  setDerivedValue(value) {
    this.setAttribute("name", value)
    this.setAttribute("edited",false)
  }

  static tagName = "g-color-name-input"
  static define() {
    customElements.define(this.tagName, ColorNameInputComponent);
  }
}
HasTemplate.mixInto(ColorNameInputComponent)
HasAttributes.mixInto(ColorNameInputComponent)
HasEvents.mixInto(ColorNameInputComponent)
export default ColorNameInputComponent
