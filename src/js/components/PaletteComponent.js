import HasTemplate             from "../brutaldom/HasTemplate"
import HasAttributes           from "../brutaldom/HasAttributes"
import HexCode                 from "../dataTypes/HexCode"
import Palette                 from "../dataTypes/Palette"
import ColorInPaletteComponent from "./ColorInPaletteComponent"
import PaletteSerializer       from "../PaletteSerializer"
import Button                  from "./Button"

class PaletteComponent extends HTMLElement {
  static attributeListeners = {
    "primary-hex-code": {
      value: HexCode,
    }
  }

  set primaryHexCode(newValue) {
    if (!this.palette.primaryHexCode) {
      this._primaryHexCode = newValue
    }
  }

  get primaryHexCode() {
    return this._primaryHexCode
  }

  constructor() {
    super()
    this.palette = new Palette()
    this.serializer = new PaletteSerializer(this.palette, window)

    this.palette.onReplaced( () => this._replacePalette() )
  }

  beforeAppendTemplate({locator}) {
    this.$addRandomColorButton = Button.wrap(locator.$e("[data-add-random-color]"))
    this.$colorSection = locator.$e("section")
  }

  afterAppendTemplate() {
    this.$addRandomColorButton.onClick( () => this._addColor() )
  }

  afterRenderTemplate() {
    this.serializer.load()
    this.palette.onChanged( () => this.serializer.save() )
  }

  render() { 
    if (!this.$element) {
      return
    }
    if (this.primaryHexCode) {
      this._ensurePrimaryColorInPalette()
    }
    else {
      this._removePrimaryColorInPalette()
    }
  }

  _ensurePrimaryColorInPalette() {
    let primaryColorInPalette = this.$element.querySelector(`${ColorInPaletteComponent.tagName}[primary='true']`)
    if (!primaryColorInPalette) {
      primaryColorInPalette = ColorInPaletteComponent.appendNewChild(
        this.$colorSection,
        {
          primary: true,
        }
      )
      primaryColorInPalette.onColorsAdded( (event) => {
        event.detail.forEach( (hexCode) => this._addColor(hexCode) )
      })
      primaryColorInPalette.onChanged( (event) => {
        const primaryColor = event.detail
        this.setAttribute("primary-hex-code",primaryColor ? primaryColor.toString() : "")
        this.palette.primaryColor = primaryColor
      })
    }

    primaryColorInPalette.updateHexCode(this.primaryHexCode)
  }
   
  _removePrimaryColorInPalette() {
    let primaryColorInPalette = this.$element.querySelector(`${ColorInPaletteComponent.tagName}[primary='true']`)
    if (primaryColorInPalette) {
      this.$colorSection.removeChild(primaryColorInPalette)
    }
  }



  _addColor(hexCode) {
    if (!this.$element) {
      return
    }

    const newColorHexCode = hexCode || this.palette.newColor()

    const newColorInPalette = ColorInPaletteComponent.appendNewChild(
      this.$colorSection,
      {
        "hex-code": newColorHexCode.toString()
      }
    )

    newColorInPalette.scrollIntoView()

    this._addIndexes()

    newColorInPalette.onChanged( (event) => {
      const index = this._getIndex(newColorInPalette)
      if (index) {
        this.palette.changeColor(index,event.detail)
      }
    })

    newColorInPalette.onRemoved( (event) => {
      const index = this._getIndex(newColorInPalette)
      if (index) {
        this.palette.removeColor(index)
      }
      this.$colorSection.removeChild(newColorInPalette) 
      this._addIndexes()
    })

    newColorInPalette.onColorsAdded( (event) => {
      event.detail.forEach( (hexCode) => this._addColor(hexCode) )
    })

    const index = this._getIndex(newColorInPalette)
    if (index) {
      this.palette.changeColor(index,newColorHexCode)
    }

  }

  _getIndex(element) {
    const index = parseInt(element.getAttribute("index"))
    if (isNaN(index)) {
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
      this.setAttribute("primary-hex-code",this.palette.primaryColor.toString())
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
    customElements.define(this.tagName, PaletteComponent);
  }
}
HasTemplate.mixInto(PaletteComponent)
HasAttributes.mixInto(PaletteComponent)

export default PaletteComponent
