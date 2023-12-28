import HasTemplate             from "../brutaldom/HasTemplate"
import HasAttributes           from "../brutaldom/HasAttributes"
import Color                   from "../dataTypes/Color"
import Palette                 from "../dataTypes/Palette"
import ColorInPaletteComponent from "./ColorInPaletteComponent"
import PaletteSerializer       from "../PaletteSerializer"
import Button                  from "./Button"

class PaletteComponent extends HTMLElement {
  static attributeListeners = {
    "primary-hex-code": {
      value: Color,
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

  afterAppendTemplate({locator}) {
    this.$addRandomColorButton = Button.wrap(locator.$e("[data-add-random-color]"))
    this.$colorSection = locator.$e("section")
    this.$addRandomColorButton.onClick( () => this._addColor(this.palette.newColor()) )
  }

  afterRenderTemplate() {
    this.serializer.load()
    this.palette.onChanged( () => this.serializer.save(), { debounce: 500 } )
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
          compact: false,
        }
      )
      primaryColorInPalette.onColorsAdded( (event) => {
        const method = event.detail
        const newColors = [
          primaryColorInPalette.hexCode[method]()
        ].flat()

        const newColorsInPalette = newColors.map( (hexCode) => {
          return this._addColor(hexCode)
        })
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

    const newColorHexCode = hexCode

    const attributes = {
      "hex-code": newColorHexCode,
      "compact": false,
    }

    const newColorInPalette = ColorInPaletteComponent.appendNewChild(
      this.$colorSection,
      attributes,
    )

    newColorInPalette.scrollIntoView()

    this._addIndexes()

    newColorInPalette.onChanged( (event) => {
      this._getIndex(newColorInPalette, (index) => {
        this.palette.changeColor(index,event.detail)
      })
    })

    newColorInPalette.onRemoved( (event) => {
      this._getIndex(newColorInPalette, (index) => {
        this.palette.removeColor(index)
      })
      this.$colorSection.removeChild(newColorInPalette) 
      this._addIndexes()
    })

    newColorInPalette.onColorsAdded( (event) => {
      const method = event.detail
      const newColors = [
        newColorInPalette.hexCode[method]()
      ].flat()
      newColors.forEach( (hexCode) => this._addColor(hexCode) )
    })

    this._getIndex(newColorInPalette, (index) => {
      this.palette.changeColor(index,newColorHexCode)
    })

    return newColorInPalette
  }

  _getIndex(element,ifIndexExists) {
    const index = parseInt(element.getAttribute("index"))
    if (!isNaN(index)) {
      ifIndexExists(index)
    }
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
