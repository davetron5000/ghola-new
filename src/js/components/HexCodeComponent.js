import HexCode from "../dataTypes/HexCode"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"

class HexCodeComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      value: HexCode,
    }
  }

  afterAppendTemplate({locator}) {
    this.$codeSlot = locator.$e("slot[name='code']")
  }

  updateHexCode(hexCode) { this.setAttribute("hex-code", hexCode.toString()) }
  clearHexCode()         { this.removeAttribute("hex-code") }

  render() {
    if (!this.$element) {
      return
    }
    if (this.hexCode) {
      this.$codeSlot.textContent = this.hexCode.toString()
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
