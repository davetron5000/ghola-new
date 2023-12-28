import Color from "../dataTypes/Color"
import HTMLId from "../dataTypes/HTMLId"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"
import IsCreatable from "../brutaldom/IsCreatable"

class EditableColorSwatchComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      value: Color,
    },
    "description": { },
    "editable": {
      value: (newValue) => newValue == "true",
    },
    "compact": {
      value: (newValue) => newValue == "true",
    },
  }

  static events = {
    hexCodeChanged: {},
  }

  constructor() {
    super()
    this.editable = true
  }

  afterAppendTemplate({locator}) {
    this.$element.addEventListener("submit", (event) =>  event.preventDefault() )
    this.$colorName = locator.$e("g-color-name")

    this.$hexCode = locator.$e("g-hex-code")

    this.$input = locator.$e("g-color-swatch-input")
    this.$input.onHexCodeChanged( (event) => this.$colorName.updateHexCode(event.detail) )
    this.$input.onHexCodeChanged( (event) => this.$hexCode.updateHexCode(event.detail) )
    this.$input.onHexCodeChanged( (event) => this.dispatchHexCodeChanged(event.detail) )

    this.$inputLabel = locator.$e("label")
  }

  connectedCallback() {
    this.addNodeFromTemplate({
      childTagName: "form",
    })
  }

  update({hexCode, description, compact}) {
    this.setAttribute("hex-code",hexCode.toString())
    this.setAttribute("description",description)
    this.setAttribute("compact",compact)
  }

  render() {
    if (!this.$element) {
      return
    }
    if (this.hexCode) {
      this.$input.updateValue(this.hexCode)
      this.$hexCode.updateHexCode(this.hexCode)
      this.$colorName.updateHexCode(this.hexCode)
    }
    else {
      this.$input.clearValue()
      this.$hexCode.clearHexCode()
      this.$colorName.clearHexCode()
    }
    if (this.description) {
      const id = HTMLId.fromString(this.description, { prefix: "color-swatch" })
      this.$inputLabel.setAttribute("for",id.toString())
      this.$inputLabel.textContent = `Choose color for ${this.description}`
      this.$input.setLabel(this.$inputLabel)
    }
    else {
      this.$input.removeLabel()
      this.$inputLabel.removeAttribute("for")
      this.$inputLabel.textContent = ""
    }
    if (this.compact) {
      this.$colorName.hide()
      this.$input.classList.remove("h-5")
      this.$input.classList.add("h-3")
    }
    else {
      this.$colorName.show()
      this.$input.classList.remove("h-3")
      this.$input.classList.add("h-5")
    }
    this.$input.editable = this.editable
  }

  static define() {
    customElements.define(this.tagName, EditableColorSwatchComponent);
  }
  static tagName = "g-editable-color-swatch"
}
HasTemplate.mixInto(EditableColorSwatchComponent)
HasAttributes.mixInto(EditableColorSwatchComponent)
HasEvents.mixInto(EditableColorSwatchComponent)
IsCreatable.mixInto(EditableColorSwatchComponent)
export default EditableColorSwatchComponent
