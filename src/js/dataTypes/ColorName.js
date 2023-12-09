import { GetColorName } from "hex-color-to-color-name"

export default class ColorName {
  constructor(hexCode) {
    this.name = this._bringIntoAtLeastTheFriggin80sFFS(GetColorName(hexCode.toString()))
  }
  toString() { return this.name }

  _bringIntoAtLeastTheFriggin80sFFS(colorName) {
    if (colorName.toLowerCase() == "flesh") {
      return "peach"
    }
    return colorName
  }

}
