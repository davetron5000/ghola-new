import HasEvents from "../brutaldom/HasEvents"
import HideableElement from "./HideableElement"

class Button extends HideableElement {

  static events = {
    "click": {}
  }

  constructor(element) {
    super(element)
    this.element.addEventListener("click", (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.dispatchClick()
    })
  }
  hide() { super.hide() }
  show() { super.show() }

  disconnectedCallback() {
    this.removeEventListeners()
  }
}
HasEvents.mixInto(Button)
export default Button
