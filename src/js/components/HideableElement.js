import NonCustomElement from "../brutaldom/NonCustomElement"

class HideableElement extends NonCustomElement {

  constructor(element) {
    super(element)
    this.display = window.getComputedStyle(this.element).display
    this.hidden  = this.display === "none"
    if (this.hidden) {
      this.display = this.element.dataset["brutaldomDisplay"]
      if (!this.display) {
        throw `If your element is hidden by default, you must set data-brutaldom-display to the display value you want to use when showing it.`
      }
    }
  }

  hide() { 
    if (!this.hidden) {
      this.element.style.display = "none"
      this.hidden = true
    }
  }
  show() {
    if (this.hidden) {
      this.element.style.display = this.display
      this.hidden = false
    }
  }

}
export default HideableElement
