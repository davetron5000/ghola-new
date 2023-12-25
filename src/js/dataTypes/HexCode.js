import chroma from "chroma-js"

export default class HexCode {
  static REGEXP = new RegExp("^(#)?([a-fA-F0-9]{6})$")

  static fromString(possiblyUndefinedString) {
    if (possiblyUndefinedString) {
      if (possiblyUndefinedString instanceof HexCode) {
        return possiblyUndefinedString
      }
      try {
        return new HexCode(possiblyUndefinedString)
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
    return new HexCode(chroma.hsl(h,s,l).hex())
  }

  static random() {
    return new HexCode(chroma.random().hex())
  }

  constructor(string) {
    const [matches, _hash, hexCode] = string.match(HexCode.REGEXP)
    if (!matches) {
      throw `'${string}' is not a valid hex code`
    }
    this.hexCode = `#${hexCode}`.toUpperCase()
  }

  toString() { return this.hexCode }
  isEqual(otherHexCode) {
    if (otherHexCode instanceof HexCode) {
      return otherHexCode.toString() === this.toString()
    }
    else {
      return false
    }
  }

  hsl() { return chroma(this.hexCode).hsl() }

  complement() {
    const [h,s,l] = this.hsl()
    const newH = (h + 180) % 360
    return HexCode.fromHSL(newH,s,l)
  }

  splitComplements() {
    return this.complement().analogous()
  }

  analogous() {
    const [h,s,l] = this.hsl()
    const newH1 = (h + 30)  % 360
    const newH2 = (h + 330) % 360

    return [
      HexCode.fromHSL(newH1,s,l),
      HexCode.fromHSL(newH2,s,l),
    ]
  }

  triad() {
    const [h,s,l] = this.hsl()
    const newH1 = (h + 120) % 360
    const newH2 = (h + 240) % 360

    return [
      HexCode.fromHSL(newH1,s,l),
      HexCode.fromHSL(newH2,s,l),
    ]
  }

}
