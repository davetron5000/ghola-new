import HasTemplate   from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"

class AddColorButtonComponent extends HTMLElement {
  static attributeListeners = {
    accent: {},
  }
  static events = {
    "click": {}
  }

  connectedCallback() {
    this.addNodeFromTemplate({
      before:({element}) => {
        this.$button = element.querySelector("button")
        if (!this.$button) {
          throw "<template> is messed up - expected a <button> but did not find one"
        }
        this.$button.addEventListener("click", (event) => {
          event.preventDefault()
          event.stopPropagation()
          this.dispatchClick()
        })
      }
    })
  }

  disable() {
    this.$button.setAttribute("disabled",true) 
  }
  enable() {
    this.$button.removeAttribute("disabled")
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.$element.tagName == "G-PE-BUTTON-ACCENT") {
      this.$element.setAttribute("color", this.accent)
    }

  }
  
  static tagName = "g-add-color-button"

  static define() {
    customElements.define(this.tagName, AddColorButtonComponent);
  }
}
HasTemplate.mixInto(AddColorButtonComponent)
HasAttributes.mixInto(AddColorButtonComponent)
HasEvents.mixInto(AddColorButtonComponent)

export default AddColorButtonComponent
