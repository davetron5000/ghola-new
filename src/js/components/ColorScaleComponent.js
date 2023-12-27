import HexCode from "../dataTypes/HexCode"
import ColorName from "../dataTypes/ColorName"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"
import ColorScale from "../dataTypes/ColorScale"

import EditableColorSwatchComponent from "./EditableColorSwatchComponent"

class ColorScaleComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": { value: HexCode },
    "compact": {
      value: (newValue) => newValue == "true",
    },
  }
  static events = {
    baseColorChange: {}
  }

  constructor() {
    super()
    this.numSteps = 7 
  }

  set hexCode(hexCode) {
    this.colorScale = new ColorScale({ numSteps: this.numSteps, hexCode: hexCode})
    this.name = new ColorName(hexCode).toString()
  }

  updateBaseColor(hexCode) {
    this.setAttribute("hex-code", hexCode.toString())
    this.dispatchBaseColorChange(hexCode)
  }

  makeNormalSize() { this.setAttribute("compact", false) }
  makeCompact() { this.setAttribute("compact", true) }

  render() {
    if (!this.$element) {
      return
    }
    if (this.name && this.colorScale) {
      if (!this.$editableColorSwatches) {
        this.$editableColorSwatches = this._createSwatches()
      }
      this.$editableColorSwatches.forEach( ($editableColorSwatch, index) => {
        $editableColorSwatch.update({
          hexCode: this.colorScale.color(index),
          description: `${this.name} level ${index}`,
          compact: this.compact
        })
      })
    }
    if (this.compact) {
      this.$element.classList.remove("pa-3", "gap-2")
      this.$element.classList.add("pa-1")
    }
    else {
      this.$element.classList.add("pa-3", "gap-2")
      this.$element.classList.remove("pa-1")
    }
  }

  _createSwatches() {
    const middle = (this.colorScale.length - 1) / 2
    return this.colorScale.map( (hexCode,index) => {
      const $editableColorSwatch = EditableColorSwatchComponent.appendNewChild(
        this.$element,
        {
          editable: index == middle,
        }
      )
      if (index == middle) {
        $editableColorSwatch.onHexCodeChanged( (event) => {
          this.updateBaseColor(event.detail)
        })
      }
      return $editableColorSwatch
    })
  }

  static tagName = "g-color-scale"
  static define() {
    customElements.define(this.tagName, ColorScaleComponent);
  }
}

HasTemplate.mixInto(ColorScaleComponent)
HasAttributes.mixInto(ColorScaleComponent)
HasEvents.mixInto(ColorScaleComponent)

export default ColorScaleComponent
