import { GetColorName } from "hex-color-to-color-name"
import ColorCategory from "./ColorCategory"
import Color from "./Color"

export default class ColorName {
  constructor(hexCode) {
    hexCode = Color.fromString(hexCode)
    this.name     = this._bringIntoAtLeastTheFriggin80sFFS(GetColorName(hexCode.toString()))
    this.category = new ColorCategory(hexCode)
  }
  toString() { return this.name }

  _bringIntoAtLeastTheFriggin80sFFS(colorName) {
    if (colorName.toLowerCase() == "flesh") {
      return "peach"
    }
    return colorName
  }

}
