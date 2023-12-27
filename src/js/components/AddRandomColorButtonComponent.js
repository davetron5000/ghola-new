import HasTemplate   from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"
import Button from "./Button"

class AddRandomColorButtonComponent extends HTMLElement {
  static attributeListeners = {
    accent: {},
  }
  static events = {
    "click": {}
  }

  connectedCallback() {
    this.addNodeFromTemplate({
      before:({locator}) => {
        this.$button = Button.wrap(locator.$e("button"))
        this.$button.onClick( (event) => {
          this.dispatchClick()
        })
      }
    })
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.$element.tagName == "G-PE-BUTTON-ACCENT") {
      this.$element.setAttribute("color", this.accent)
    }

  }
  
  static tagName = "g-add-random-color-button"

  static define() {
    customElements.define(this.tagName, AddRandomColorButtonComponent);
  }
}
HasTemplate.mixInto(AddRandomColorButtonComponent)
HasAttributes.mixInto(AddRandomColorButtonComponent)
HasEvents.mixInto(AddRandomColorButtonComponent)

export default AddRandomColorButtonComponent
