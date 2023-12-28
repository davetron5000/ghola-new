import Color from "./dataTypes/Color"

export default class PaletteSerializer {

  constructor(palette, window) {
    this.palette = palette
    this.window = window

    this.window.addEventListener("popstate", (event) => {
      if (event.state) {
        this.palette.replace(
          Color.fromString(event.state.primaryColor),
          (event.state.otherColors || []).map( (string) => Color.fromString(string) ),
        )
      }
    })
  }

  save() {
    const state = {}
    if (this.palette.primaryColor) {
      state.primaryColor = this.palette.primaryColor.toString()
    }
    state.otherColors = this.palette.otherColors.map( (color) => color ? color.toString() : "" )
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
    const otherColors = (url.searchParams.get("otherColors") || "").split(",").
      map( (string) => Color.fromString(string) ).
      filter( (possiblyNullColor) => possiblyNullColor )

    this.palette.replace(
      Color.fromString(url.searchParams.get("primaryColor")),
      otherColors
    )
  }
}
