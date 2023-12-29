import HasTemplate             from "../brutaldom/HasTemplate"
import HasAttributes           from "../brutaldom/HasAttributes"
import Color                   from "../dataTypes/Color"
import ColorWheel              from "../dataTypes/ColorWheel"
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
      klass: RichString,
    },
    "compact": {
      klass: Boolean
    }
  }

  constructor() {
    super()
    this.palette    = new Palette()
    window.blah = this.palette
    this.serializer = new PaletteSerializer(this.palette, window)

    this.palette.onReplaced( () => this._replacePalette() )
  }

  afterAppendTemplate({locator}) {
    this.$addRandomColorButton = Button.wrap(locator.$e("[data-add-random-color]"))
    this.$colorSection = locator.$e("section")
    this.$addRandomColorButton.onClick( () => this._addColor({ color: this.palette.newColor() }) )
  }

  afterRenderTemplate() {
    this.serializer.load()
    this.palette.onChanged( () => this.serializer.save(), { debounce: 100 } )
    this.$compactCheckbox = document.querySelector("input[type=checkbox][name='compact']")
    if (this.$compactCheckbox) {
      this.$compactCheckbox.addEventListener("change", (event) => {
        this.setAttribute("compact",event.target.checked)
      })
    }
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
    this.$element.querySelectorAll(ColorInPaletteComponent.tagName).forEach( (element) => {
      if (this.compact) {
        element.makeCompact()
      }
      else {
        element.makeNormalSize()
      }
    })
  }

  _ensurePrimaryColorInPalette() {
    let primaryColorInPalette = this.$element.querySelector(`${ColorInPaletteComponent.tagName}[primary='true']`)
    if (!primaryColorInPalette) {
      primaryColorInPalette = ColorInPaletteComponent.appendNewChild(
        this.$colorSection,
        {
          primary: true,
          compact: this.compact,
        }
      )

      this._handleColorLinking(primaryColorInPalette)

      primaryColorInPalette.onBaseColorChanged( (event) => {
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


  _addColor({color,deriveFrom,algorithm,userSuppliedName}) {
    if (!this.$element) {
      return
    }
    if (color && deriveFrom) {
      throw `You cannot use both color and deriveFrom in _addColor`
    }
    if (color && userSuppliedName) {
      throw `userSuppliedName is ignored if you are using color in _addColor`
    }
    if (deriveFrom && !algorithm) {
      throw `If you use deriveFrom, you must specify algorithm in _addColor`
    }

    const newColorInPalette = ColorInPaletteComponent.appendNewChild(
      this.$colorSection,
      {
        compact: this.compact,
      }
    )

    this._addIndexes()
    this._handleColorLinking(newColorInPalette)

    if (deriveFrom) {
      const colorDerivationId = deriveFrom.ensureColorDerivationId()
      newColorInPalette.deriveColorFrom(colorDerivationId,algorithm,userSuppliedName)
      this._getIndex(newColorInPalette, (index) => {
        this.palette.linkToPrimary(index,algorithm)
      })
    }
    else {
      newColorInPalette.updateColor(color)
      this._getIndex(newColorInPalette, (index) => {
        this.palette.changeColor(index,color)
      })
    }


    newColorInPalette.onBaseColorChanged( (event) => {
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


    newColorInPalette.onNameChanged( (event) => {
      this._getIndex(newColorInPalette, (index) => {
        this.palette.renameColor(index,event.detail)
      })
    })

    newColorInPalette.scrollIntoView()
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
    let primaryColorInPalette = null
    document.querySelectorAll(ColorInPaletteComponent.tagName).forEach( (element) => {
      if (element.getAttribute("primary") === "true") {
        if (this.palette.primaryColor) {
          this.setAttribute("primary-hex-code",this.palette.primaryColor)
          element.updateColor(this.palette.primaryColor)
        }
        else {
          element.updateColor(this.primaryColor)
        }
        primaryColorInPalette = element
      }
      else {
        element.parentElement.removeChild(element) 
      }
    })
    this.palette.otherColors.forEach( (color) => {
      if (color) {
        if (color instanceof Color) {
          this._addColor({color})
        }
        else {
          if (primaryColorInPalette) {
            this._addColor({
              deriveFrom: primaryColorInPalette,
              algorithm: color.algorithm,
              userSuppliedName: color.userSuppliedName
            }) 
          }
          else {
            console.warn("Asked to link via %s but we have no primary color",color.constructor.name)
          }
        }
      }
    })
  }

  _handleColorLinking(colorInPalette) {
    colorInPalette.onDerivedColorsAdded( (event) => {
      event.detail.forEach( (algorithm) => {
        this._addColor({ deriveFrom: colorInPalette, algorithm: algorithm }) 
      })
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
