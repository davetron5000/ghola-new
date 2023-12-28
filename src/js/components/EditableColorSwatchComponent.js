import Color from "../dataTypes/Color"
import HTMLId from "../dataTypes/HTMLId"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"
import IsCreatable from "../brutaldom/IsCreatable"

class EditableColorSwatchComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      attributeName: "color",
      klass: Color,
    },
    "description": { },
    "editable": {
      klass: Boolean,
    },
    "compact": {
      klass: Boolean,
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
    this.$input.onValueChanged( (event) => this.$colorName.updateColor(Color.fromString(event.detail)) )
    this.$input.onValueChanged( (event) => this.$hexCode.updateColor(Color.fromString(event.detail)) )
    this.$input.onValueChanged( (event) => this.dispatchHexCodeChanged(Color.fromString(event.detail)) )

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
    if (this.color) {
      this.$input.updateValue(this.color.toString())
      this.$hexCode.updateColor(this.color)
      this.$colorName.updateColor(this.color)
    }
    else {
      this.$input.clearValue()
      this.$hexCode.clearColor()
      this.$colorName.clearColor()
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
