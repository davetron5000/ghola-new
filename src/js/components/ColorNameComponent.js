import ColorName from "../dataTypes/ColorName"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"

class ColorNameComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      attributeName: "colorName",
      value: ColorName,
    }
  }

  connectedCallback() {
    this.addNodeFromTemplate({
      before: ({locator}) => {
        this.$nameSlot = locator.$e("slot[name='name']")
      }
    })
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.colorName) {
      this.$nameSlot.textContent = this.colorName
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
