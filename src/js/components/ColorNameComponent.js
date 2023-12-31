import Color         from "../dataTypes/Color"
import HasTemplate   from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"

class ColorNameComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      attributeName: "color",
      klass: Color,
    }
  }

  afterAppendTemplate({locator}) {
    this.$nameSlot = locator.$e("slot[name='name']")
  }

  updateColor(color) { this.setAttribute("hex-code", color.toString()) }
  clearColor()       { this.removeAttribute("hex-code") }

  hide()  { this.style.display = "none" }
  show()  { this.style.display = "block" }


  render() {
    if (!this.$element) {
      return
    }
    if (this.color) {
      this.$nameSlot.textContent = this.color.name
    }
    else {
      this.$nameSlot.textContent = ""
    }
  }

  static tagName = "g-color-name"
  static define() {
    customElements.define(this.tagName, ColorNameComponent);
  }
}
HasTemplate.mixInto(ColorNameComponent)
HasAttributes.mixInto(ColorNameComponent)
export default ColorNameComponent
