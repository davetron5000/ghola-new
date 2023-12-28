import chroma from "chroma-js"
import ColorName from "./ColorName"

export default class Color {
  static REGEXP = new RegExp("^(#)?([a-fA-F0-9]{6})$")

  static fromString(possiblyUndefinedString) {
    if (possiblyUndefinedString) {
      if (possiblyUndefinedString instanceof Color) {
        return possiblyUndefinedString
      }
      try {
        return new Color(possiblyUndefinedString)
      }
      catch (e) {
        throw e
        console.warn("When parsing: %o (%s): %o",possiblyUndefinedString,typeof possiblyUndefinedString,e)
        return null
      }
    }
    else {
      return null
    }
  }

  static fromHSL(h,s,l) {
    return new Color(chroma.hsl(h,s,l).hex())
  }

  static random() {
    return new Color(chroma.random().hex())
  }

  static nextId() {
    if (!this._nextId) {
      this._nextId = 0
    }
    this._nextId = this._nextId + 1
    return this._nextId;
  }

  constructor(hexCodeAsString) {
    const [matches, _hash, hexCode] = hexCodeAsString.match(Color.REGEXP)
    if (!matches) {
      throw `'${hexCodeAsString}' is not a valid hex code`
    }
    this.hexCode = `#${hexCode}`.toUpperCase()
    this.objectId = Color.nextId()
    this.name     = new ColorName(this)
  }

  toString() { return this.hexCode }
  isEqual(otherColor) {
    if (otherColor instanceof Color) {
      return otherColor.toString() === this.toString()
    }
    else {
      return false
    }
  }

  hsl() { return chroma(this.hexCode).hsl() }
  hue() { return this.hsl()[0] }

  complement() {
    const [h,s,l] = this.hsl()
    const newH = (h + 180) % 360
    return Color.fromHSL(newH,s,l)
  }

  splitComplements() {
    return this.complement().analogous()
  }

  analogous() {
    const [h,s,l] = this.hsl()
    const newH1 = (h + 30)  % 360
    const newH2 = (h + 330) % 360

    return [
      Color.fromHSL(newH1,s,l),
      Color.fromHSL(newH2,s,l),
    ]
  }

  triad() {
    const [h,s,l] = this.hsl()
    const newH1 = (h + 120) % 360
    const newH2 = (h + 240) % 360

    return [
      Color.fromHSL(newH1,s,l),
      Color.fromHSL(newH2,s,l),
    ]
  }

}
