export default class HexCode {
  static REGEXP = new RegExp("^(#)?([a-fA-F0-9]{6})$")
  constructor(string) {
    const [matches, _hash, hexCode] = string.match(HexCode.REGEXP)
    if (!matches) {
      throw `'${string}' is not a valid hex code`
    }
    this.hexCode = `#${hexCode}`.toUpperCase()
  }

  toString() { return this.hexCode }
}
