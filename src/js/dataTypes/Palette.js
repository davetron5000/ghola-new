import chroma from "chroma-js"

import HexCode from "../dataTypes/HexCode"
import HasEvents from "../brutaldom/HasEvents"

class Palette extends EventTarget {
  static events = {
    changed: {},
    replaced: {},
  }

  constructor(...hexCodes) {
    super()
    this.hexCodes = hexCodes
  }

  replace(primaryColor,otherColors) {
    this.hexCodes = [
      primaryColor
    ].concat(otherColors)
    this.dispatchReplaced()
  }

  set primaryColor(hexCode) {
    this.changeColor(0,hexCode)
  }

  get primaryColor() {
    return this.hexCodes[0]
  }

  get otherColors() {
    return this.hexCodes.slice(1)
  }

  changeColor(index,hexCode) {
    const oldHexCode = this.hexCodes[index]
    if (oldHexCode && oldHexCode.isEqual(hexCode)) {
      return
    }
    this.hexCodes[index] = hexCode
    this.dispatchChanged()
  }
  removeColor(index) {
    if (this.hexCodes[index]) {
      this.hexCodes.splice(index,1)
      this.dispatchChanged()
    }
  }

  newColor() {
    return new HexCode(chroma.random().hex())
  }
}
HasEvents.mixInto(Palette)
export default Palette
