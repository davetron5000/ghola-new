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
}
