import HexCode       from "./dataTypes/HexCode"

export default class PaletteSerializer {

  constructor(palette, window) {
    this.palette = palette
    this.palette.onChanged( () => this.save() )
    this.window = window

    this.window.addEventListener("popstate", (event) => {
      if (event.state) {
        this.palette.replace(
          HexCode.fromString(event.state.primaryColor),
          (event.state.otherColors || []).map( (string) => HexCode.fromString(string) ),
        )
      }
    })
  }

  save() {
    const state = {}
    if (this.palette.primaryColor) {
      state.primaryColor = this.palette.primaryColor.toString()
    }
    state.otherColors = this.palette.otherColors.map( (hexCode) => hexCode ? hexCode.toString() : "" )
    const url = new URL(this.window.location);

    if (state.primaryColor) {
      url.searchParams.set("primaryColor", state.primaryColor)
    }
    url.searchParams.set("otherColors", state.otherColors.join(","))
    history.pushState(
      state,
      "",
      url.toString()
    )
  }

  load() {
    const url = new URL(this.window.location);
    this.palette.replace(
      HexCode.fromString(url.searchParams.get("primaryColor")),
      (url.searchParams.get("otherColors") || "").split(",").map( (string) => HexCode.fromString(string) )
    )
  }
}
