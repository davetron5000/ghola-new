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

  render() {
    if (!this.$element) {
      return
    }
    if (this.name && this.colorScale) {
      if (!this.$editableColorSwatches) {
        this.$editableColorSwatches = this._createSwatches()
      }
      this.$editableColorSwatches.forEach( ($editableColorSwatch, index) => {
        $editableColorSwatch.updateHexCode(
          this.colorScale.color(index),
          `${this.name} level ${index}`
        )
      })
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
