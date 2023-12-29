import Color from "./dataTypes/Color"
import RichString from "./brutaldom/RichString"

class HexCodeAndName {

  static NULL_VALUE = {
    asColor: () => null
  }

  static fromString(string) {
    if (string) {
      const [hexCode,...nameParts] = string.split(/:/)
      const name = nameParts.length > 0 ? nameParts.join(":") : null
      return new HexCodeAndName(hexCode,name)
    }
    else {
      return HexCodeAndName.NULL_VALUE
    }
  }

  constructor(hexCode,name) {
    this.hexCode = hexCode
    this.name = name
  }


  asColor() {
    const color = Color.fromString(this.hexCode)
    if (color && this.name) {
      color.userSuppliedName = RichString.fromString(this.name)
    }
    return color
  }
}

class PaletteState {

  static fromState(state) {
    let primaryColor
    if (state.primaryColor) {
      primaryColor = Color.fromString(state.primaryColor.hexCode)
      if (primaryColor) {
        primaryColor.userSuppliedName = state.primaryColor.userSuppliedName
      }
    }
    const otherColors = (state.otherColors || []).map( (otherColorFromState) => {
      if (otherColorFromState && otherColorFromState.hexCode) {
        const otherColor = Color.fromString(otherColorFromState.hexCode)
        otherColor.userSuppliedName = otherColorFromState.userSuppliedName
        return otherColor
      }
      else {
        return null
      }

    })
    return new PaletteState(
      primaryColor,
      otherColors
    )
  }

  constructor(primaryColor,otherColors) {
    this.primaryColor = primaryColor
    this.otherColors = otherColors

    this.state = {}
    this.searchParams = []

    if (this.primaryColor) {
      this.state.primaryColor = {
        hexCode: this.primaryColor.hexCode,
      }
      if (this.primaryColor.userSuppliedName) {
        this.state.primaryColor.userSuppliedName = this.primaryColor.userSuppliedName.toString()
      }
      this.searchParams.push(
        [
          "primaryColor",
          this._colorToParam(this.primaryColor)
        ]
      )
    }
    this.state.otherColors = this.otherColors.map( (color) => {
      if (color) {
        const colorState = {
          hexCode: color.hexCode,
        }
        if (color.userSuppliedName) {
          colorState.userSuppliedName = color.userSuppliedName.toString()
        }
        return colorState
      }
      else {
        return {}
      }
    })
    this.searchParams.push(
      [
        "otherColors",
        this.otherColors.map( (color) => this._colorToParam(color) ).join(",")
      ]
    )
  }

  asSearchParams() { return this.searchParams }
  asState() { return this.state }

  _colorToParam(color) {
    if (color) {
      if (color.userSuppliedName) {
        return `${color.toString()}:${color.userSuppliedName}`
      }
      else {
        return color.toString()
      }

    }
    else {
      return ""
    }
  }

}

export default class PaletteSerializer {

  constructor(palette, window) {
    this.palette = palette
    this.window = window

    this.window.addEventListener("popstate", (event) => {
      if (event.state) {
        this.replace(PaletteState.fromState(event.state))
      }
      else {
        this.clear()
      }
    })
  }

  save() {
    const state = new PaletteState(this.palette.primaryColor,this.palette.otherColors)

    const url = new URL(this.window.location);

    state.asSearchParams().forEach( ([key,value]) => url.searchParams.set(key, value) )

    history.pushState(
      state.asState(),
      "",
      url.toString()
    )
  }

  load() {
    const url = new URL(this.window.location);
    const primaryColor = HexCodeAndName.fromString(url.searchParams.get("primaryColor")).asColor()
    const otherColors = (url.searchParams.get("otherColors") || "").split(",").
      map( (string) => HexCodeAndName.fromString(string).asColor() ).
      filter( (possiblyNullColor) => possiblyNullColor )

    this.palette.replace(
      primaryColor,
      otherColors
    )
  }

  replace(paletteState) {
    this.palette.replace(
      paletteState.primaryColor,
      paletteState.otherColors
    )
  }

  clear() {
    this.window.location.reload()
  }
}
