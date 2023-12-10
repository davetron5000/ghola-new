import HasTemplate from "../brutaldom/HasTemplate"

class ResetButtonComponent extends HTMLElement {
  connectedCallback() {
    this.addNodeFromTemplate()
  }

  hide() {
    this.$element.style.visibility = "hidden"
  }
  show() {
    this.$element.style.visibility = "visible"
  }
  disable(){
    this.$element.setAttribute("disabled",true) 
  }
  enable() {
    this.$element.removeAttribute("disabled")
  }

  _render() { }

  static tagName = "g-reset-button"

  static define() {
    customElements.define(this.tagName, ResetButtonComponent);
  }
}
HasTemplate.mixInto(ResetButtonComponent)

export default ResetButtonComponent
