import Color from "../dataTypes/Color"
import HasEvents from "../brutaldom/HasEvents"

class Palette extends EventTarget {
  static events = {
    changed: {},
    replaced: {},
  }

  constructor() {
    super()
    this.colors = []
  }

  replace(primaryColor,otherColors) {
    this.colors = [
      primaryColor
    ]
    otherColors.forEach( (color) => {
      this.colors.push(color)
    })
    this.dispatchReplaced()
  }

  set primaryColor(color) {
    this.changeColor(0,color)
  }

  get primaryColor() {
    return this.colors[0]
  }

  get otherColors() {
    return this.colors.slice(1)
  }

  changeColor(index,color) {
    const oldColor = this.colors[index]
    if (oldColor && oldColor.isEqual(color)) {
      return
    }
    this.colors[index] = color
    this.dispatchChanged()
  }
  removeColor(index) {
    if (this.colors[index]) {
      this.colors.splice(index,1)
      this.dispatchChanged()
    }
  }

  newColor() {
    return Color.random()
  }
}
HasEvents.mixInto(Palette)
export default Palette
