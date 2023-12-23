import HexCode from "../dataTypes/HexCode"
import ColorName from "../dataTypes/ColorName"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"
import ColorScale from "../dataTypes/ColorScale"

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

  connectedCallback() {
    this.addNodeFromTemplate()
  }

  _updateSwatch(swatch,index) {
    swatch.setAttribute("hex-code", this.colorScale.color(index).toString())
    swatch.setAttribute("description", `${this.name} level ${index}`)
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.name && this.colorScale) {
      if (!this.swatches) {
        this.swatches = this._createSwatches()
      }
      this.swatches.forEach( (swatch, index) => this._updateSwatch(swatch,index) )
    }
  }
  _createSwatches() {
    const middle = (this.colorScale.length - 1) / 2
    return this.colorScale.map( (hexCode,index) => {
      const swatch = document.createElement("g-editable-color-swatch")
      this.$element.appendChild(swatch)
      if (index == middle) {
        swatch.setAttribute("editable", true)
        swatch.onHexCodeChanged( (event) => {
          this.setAttribute("hex-code",event.detail.toString())
          this.dispatchBaseColorChange(event.detail)
        })
      }
      else {
        swatch.setAttribute("editable", false)
      }
      return swatch
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
