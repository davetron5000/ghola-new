import HasTemplate             from "../brutaldom/HasTemplate"
import HasAttributes           from "../brutaldom/HasAttributes"
import Color                   from "../dataTypes/Color"
import Palette                 from "../dataTypes/Palette"
import ColorInPaletteComponent from "./ColorInPaletteComponent"
import PaletteSerializer       from "../PaletteSerializer"
import Button                  from "./Button"
import RichString              from "../brutaldom/RichString"

class PaletteComponent extends HTMLElement {
  static attributeListeners = {
    "primary-hex-code": {
      klass: Color,
      attributeName: "primaryColor",
    },
    "primary-color-name": {
      value: RichString,
    },
  }

  constructor() {
    super()
    this.palette    = new Palette()
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
    this.palette.onChanged( () => this.serializer.save(), { debounce: 100 } )
  }

  render() { 
    if (!this.$element) {
      return
    }
    if (this.primaryColor) {
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
          primaryColorInPalette.color[method]()
        ].flat()

        const newColorsInPalette = newColors.map( (color) => {
          return this._addColor(color)
        })
      })
      primaryColorInPalette.onChanged( (event) => {
        const primaryColor = event.detail
        this.setAttribute("primary-hex-code",primaryColor ? primaryColor.toString() : "")
        this.palette.primaryColor = primaryColor
      })
      primaryColorInPalette.onNameChanged( (event) => {
        this.palette.renamePrimaryColor(event.detail)
      })
    }

    primaryColorInPalette.updateColor(this.primaryColor)
  }
   
  _removePrimaryColorInPalette() {
    let primaryColorInPalette = this.$element.querySelector(`${ColorInPaletteComponent.tagName}[primary='true']`)
    if (primaryColorInPalette) {
      this.$colorSection.removeChild(primaryColorInPalette)
    }
  }


  _addColor(color) {
    if (!this.$element) {
      return
    }

    const attributes = {
      "compact": false,
    }

    const newColorInPalette = ColorInPaletteComponent.appendNewChild(
      this.$colorSection,
      attributes,
    )

    newColorInPalette.updateColor(color)
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
        newColorInPalette.color[method]()
      ].flat()
      newColors.forEach( (color) => this._addColor(color) )
    })

    newColorInPalette.onNameChanged( (event) => {
      this._getIndex(newColorInPalette, (index) => {
        this.palette.renameColor(index,event.detail)
      })
    })

    this._getIndex(newColorInPalette, (index) => {
      this.palette.changeColor(index,color)
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
    document.querySelectorAll(ColorInPaletteComponent.tagName).forEach( (element) => {
      if (element.getAttribute("primary") === "true") {
        if (this.palette.primaryColor) {
          this.setAttribute("primary-hex-code",this.palette.primaryColor)
          element.updateColor(this.palette.primaryColor)
        }
        else {
          element.updateColor(this.primaryColor)
        }
      }
      else {
        element.parentElement.removeChild(element) 
      }
    })
    this.palette.otherColors.forEach( (color) => {
      if (color) {
        this._addColor(color)
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
