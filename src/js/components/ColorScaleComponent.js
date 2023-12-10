import HexCode from "../dataTypes/HexCode"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import chroma from "chroma-js"

class ColorScale {
  constructor({hexCode,numSteps}) {
    this.hexCode = hexCode
    this.numSteps = numSteps
    if (this.numSteps % 2 == 0) {
      throw `numSteps must be odd`
    }
    if (this.numSteps < 3) {
      throw `numSteps must be at least 3`
    }
    this.scale = this._calculateScale()
  }

  _calculateScale() {
    const lower = chroma.scale(["black",this.hexCode.toString()])
    const upper = chroma.scale([this.hexCode.toString(),"white"])

    const scaleSteps = ((this.numSteps - 1) / 2) + 2

    const lowerColors = lower.colors(scaleSteps).map( (string) => new HexCode(string) )
    const upperColors = upper.colors(scaleSteps).map( (string) => new HexCode(string) )
    return lowerColors.slice(1,scaleSteps-1).concat([this.hexCode]).concat(upperColors.slice(1,scaleSteps-1))
  }

}
class ColorScaleComponent extends HTMLElement {
  static observedAttributes = [
    "name",
    "hex-code",
  ]
  static attributeListeners = {
    "name": {},
    "hex-code": { klass: HexCode },
  }
  constructor() {
    super()
    this.numSteps = 7
  }

  set hexCode(hexCode) {
    this.scale = new ColorScale({ numSteps: 7, hexCode: hexCode })
  }

  connectedCallback() {
    this.addNodeFromTemplate()
  }

  _render() {
    if (!this.$element) {
      return
    }
    if (this.name && this.scale) {
      if (!this.swatches) {
        this.swatches = this._createSwatches()
      }
      else {
        this.swatches.forEach( (swatch, index) => {
          swatch.setAttribute("hex-code", this.scale.scale[index].toString())
        })
      }
    }
  }
  _createSwatches() {
    return this.scale.scale.map( (hexCode,index) => {
      const swatch = document.createElement("g-editable-color-swatch")
      swatch.setAttribute("editable", index == 3)
      swatch.setAttribute("description", `${name} level ${index}`)
      swatch.setAttribute("hex-code", hexCode.toString())
      this.$element.appendChild(swatch)
      if (index == 3) {
        swatch.onUserChange( (event) => {
          this.setAttribute("hex-code",event.detail.value.toString())
        })
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
export default ColorScaleComponent
