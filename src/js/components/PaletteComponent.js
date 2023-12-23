import HasTemplate   from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents     from "../brutaldom/HasEvents"
import HexCode       from "../dataTypes/HexCode"
import Palette       from "../dataTypes/Palette"

import ColorInPaletteComponent from "./ColorInPaletteComponent"

class PaletteSerializer {

  constructor(palette) {
    this.palette = palette
    this.palette.onChanged( () => this.save() )
    window.addEventListener("popstate", (event) => {
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
    const url = new URL(window.location);

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
    const url = new URL(window.location);
    this.palette.replace(
      HexCode.fromString(url.searchParams.get("primaryColor")),
      (url.searchParams.get("otherColors") || "").split(",").map( (string) => HexCode.fromString(string) )
    )
  }
}

class PaletteComponentComponent extends HTMLElement {
  static attributeListeners = {
    "primary-hex-code": {
      value: HexCode,
      debug: true,
    }
  }

  static events = {
    primaryHexCodeChanged: {},
    colorAdded: {},
    colorRemoved: {},
    colorChanged: {},
  }

  constructor() {
    super()
    this.palette = new Palette()
    this.serializer = new PaletteSerializer(this.palette)

    this.onPrimaryHexCodeChanged( (event) => this.palette.primaryColor = event.detail )
    this.onColorAdded( (event) => this.palette.changeColor(event.detail.index,event.detail.hexCode))
    this.onColorChanged( (event) => this.palette.changeColor(event.detail.index,event.detail.hexCode))
    this.onColorRemoved( (event) => this.palette.removeColor(event.detail.index))
    this.palette.onReplaced( (event) => this._replacePalette() )

    this.serializer.load()
  }

  connectedCallback() {
    this.addNodeFromTemplate({
      before: ({element}) => {
        this.$addColorButton = element.querySelector("g-add-color-button")
        if (!this.$addColorButton) {
          throw "<template> is messed up - expected a <g-add-color-button>"
        }
        this.$colorSection = element.querySelector("section")
        if (!this.$colorSection) {
          throw "<template> is messed up - expected a <section>"
        }
      },
      after: () => {
        this.$addColorButton.onClick( () => {
          this._addColor()
        })
      }
    })
    this._replacePalette()
  }


  _render() { 
    if (!this.$element) {
      return
    }

    let primaryColorInPalette = this.$element.querySelector(`${ColorInPaletteComponent.tagName}[primary='true']`)
    if (this.primaryHexCode) {
      if (!primaryColorInPalette) {
        primaryColorInPalette = document.createElement(ColorInPaletteComponent.tagName)
        primaryColorInPalette.setAttribute("primary", true)
        this.$colorSection.appendChild(primaryColorInPalette)
      }
      primaryColorInPalette.setAttribute("hex-code", this.primaryHexCode.toString())
      this.dispatchPrimaryHexCodeChanged(this.primaryHexCode)

      primaryColorInPalette.onChanged( (event) => {
        const hexCode = event.detail
        this.setAttribute("primary-hex-code",hexCode ? hexCode.toString() : "")
        this.dispatchPrimaryHexCodeChanged(hexCode)
      })

    }
    else {
      if (primaryColorInPalette) {
        this.$colorSection.removeChild(primaryColorInPalette)
        this.dispatchPrimaryHexCodeChanged(null)
      }
    }
  }

  _addColor(hexCode) {
    if (!this.$element) {
      return
    }

    const newColorInPalette = document.createElement(ColorInPaletteComponent.tagName)
    const newColorHexCode = hexCode || this.palette.newColor()
    newColorInPalette.setAttribute("hex-code", newColorHexCode.toString())
    this.$colorSection.appendChild(newColorInPalette)
    newColorInPalette.scrollIntoView()

    this._addIndexes()


    newColorInPalette.onChanged( (event) => {
      const index = this._getIndex(newColorInPalette)
      if (index) {
        this.dispatchColorChanged({ index: index, hexCode: event.detail })
      }
    })

    newColorInPalette.onRemoved( (event) => {
      const index = this._getIndex(newColorInPalette)
      if (index) {
        this.dispatchColorRemoved({ index: index }) 
      }
    })

    newColorInPalette.onRemoved( (event) => {
      this.$colorSection.removeChild(newColorInPalette) 
      this._addIndexes()
    })

    const index = this._getIndex(newColorInPalette)
    if (index) {
      this.dispatchColorAdded({ index: index, hexCode: newColorHexCode})
    }

  }

  _getIndex(element) {
    const index = parseInt(element.getAttribute("index"))
    if (isNaN(index)) {
      console.warn("Element %o did not have an index attribute", element)
      return null
    }
    return index
  }

  _addIndexes() {
    document.querySelectorAll(ColorInPaletteComponent.tagName).forEach( (element, index) => {
      element.setAttribute("index", index)
    })
  }

  _replacePalette() {

    if (this.palette.primaryColor) {
      this.setAttribute("primary-hex-code", this.palette.primaryColor.toString())
    }
    document.querySelectorAll(ColorInPaletteComponent.tagName).forEach( (element) => {
      if (element.getAttribute("primary") !== "true") {
        element.parentElement.removeChild(element) 
      }
    })
    this.palette.otherColors.forEach( (hexCode) => {
      if (hexCode) {
        this._addColor(hexCode)
      }
    })
  }
  
  static tagName = "g-palette"

  static define() {
    customElements.define(this.tagName, PaletteComponentComponent);
  }
}
HasTemplate.mixInto(PaletteComponentComponent)
HasAttributes.mixInto(PaletteComponentComponent)
HasEvents.mixInto(PaletteComponentComponent)

export default PaletteComponentComponent
