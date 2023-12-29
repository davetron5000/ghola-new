import Color                   from "../dataTypes/Color"
import ColorWheel              from "../dataTypes/ColorWheel"
import ColorName               from "../dataTypes/ColorName"
import HasTemplate             from "../brutaldom/HasTemplate"
import HasAttributes           from "../brutaldom/HasAttributes"
import HasEvents               from "../brutaldom/HasEvents"
import IsCreatable             from "../brutaldom/IsCreatable"
import Button                  from "./Button"
import ColorNameInputComponent from "./ColorNameInputComponent"
import RichString              from "../brutaldom/RichString"

class ColorInPaletteComponent extends HTMLElement {
  static DEBUG_EVENTS = true
  static attributeListeners = {
    "hex-code": {
      klass: Color,
      attributeName: "color",
    },
    "primary": {
      klass: Boolean,
    },
    "compact": {
      klass: Boolean,
    },
    "user-color-name": {
      klass: RichString,
    },
    "color-deriviation-id": {},
    "color-derived-from-id": {},
    "color-derived-by-algorithm": {},
  }

  static events = {
    removed: {},
    baseColorChanged: {},
    derivedColorsAdded: {},
    nameChanged: {},
  }


  afterAppendTemplate({locator}) {
    this.$colorScale = locator.$e("g-color-scale")
    this.$colorScale.onBaseColorChange( (event) => {
      if (this.colorDerivedFromId) {
      }
      else {
        this.dispatchBaseColorChanged(event.detail)
        this.setAttribute("hex-code",event.detail) 
      }
    })

    this.$analogousButton = Button.wrap(locator.$e("button[data-analogous]"))
    this.$analogousButton.onClick( () => this.dispatchDerivedColorsAdded(ColorWheel.algorithms.analogous()) )

    this.$complementButton = Button.wrap(locator.$e("button[data-complement]"))
    this.$complementButton.onClick( () => this.dispatchDerivedColorsAdded(ColorWheel.algorithms.complement()) )

    this.$splitComplementButton = Button.wrap(locator.$e("button[data-split-complement]"))
    this.$splitComplementButton.onClick( () => this.dispatchDerivedColorsAdded(ColorWheel.algorithms.splitComplement()) )

    this.$triadButton = Button.wrap(locator.$e("button[data-triad]"))
    this.$triadButton.onClick( () => this.dispatchDerivedColorsAdded(ColorWheel.algorithms.triad()) )

    this.$removeButton = Button.wrap(locator.$e("button[data-remove]"))
    this.$removeButton.onClick( () => this.dispatchRemoved(event.detail) )

    this.$nameInput = locator.$e("g-color-name-input")
    this.$nameInput.onEdited( (event) => this.setAttribute("user-color-name",event.detail) )
    this.$nameInput.onEdited( (event) => this.dispatchNameChanged(event.detail) )
    this.$nameInput.onCleared( (event) => this.removeAttribute("user-color-name") )
    this.$nameInput.onCleared( (event) => this.dispatchNameChanged(null) )
  }

  disconnectedCallback() {
    this.removeEventListeners()
    this.$removeButton.disconnectedCallback()
  }

  updateColor(color) {
    this.setAttribute("hex-code",color)
    if (color.userSuppliedName) {
      this.setAttribute("user-color-name",color.userSuppliedName)
    }
    else {
      this.removeAttribute("user-color-name")
    }
  }
  makeCompact() { this.setAttribute("compact",true) }
  makeNormalSize() { this.setAttribute("compact",false) }

  clearColor() {
    this.removeAttribute("hex-code")
    this.removeAttribute("user-color-name")
  }

  deriveColorFrom(colorDerivationId,algorithm) {
    this.setAttribute("color-derived-from-id",colorDerivationId)
    this.setAttribute("color-derived-by-algorithm",algorithm)
  }

  ensureColorDerivationId() {
    let id = this.getAttribute("color-derivation-id")
    if (!id || id === "") {
      id = crypto.randomUUID()
      console.log("Setting colorDerivationId to %s",id)
      this.setAttribute("color-derivation-id",id)
    }
    return id
  }

  render() {
    if (!this.$element) {
      return
    }
    if (this.color) {
      this.$colorScale.updateBaseColor(this.color)
    }
    if (this.userColorName) {
      this.$nameInput.setEditedValue(this.userColorName)
    }
    else {
      if (this.color) {
        this.$nameInput.setDerivedValue(this.color.category.humanize())
      }
      else {
        this.$nameInput.setDerivedValue("")
      }
    }
    if (this.primary) {
      this.$removeButton.hide()
      this.$complementButton.show()
      this.$splitComplementButton.show()
      this.$analogousButton.show()
      this.$triadButton.show()
    }
    else {
      this.$removeButton.show()
      this.$complementButton.hide()
      this.$splitComplementButton.hide()
      this.$analogousButton.hide()
      this.$triadButton.hide()
    }
    if (this.compact) {
      this.$colorScale.makeCompact()
    }
    else {
      this.$colorScale.makeNormalSize()
    }
    if (this.colorDerivedFromId && this.colorDerivedByAlgorithm) {
      const otherComponentInPalette = document.querySelector(`[color-derivation-id='${this.colorDerivedFromId}']`)
      if (otherComponentInPalette) {
        const updateColorFromDerived = () => {
          const algorithm = ColorWheel.algorithm(this.colorDerivedByAlgorithm)
          const otherColor = otherComponentInPalette.color
          this.setAttribute("hex-code",algorithm.deriveFrom(otherColor))
        }
        otherComponentInPalette.onBaseColorChanged( (event) => updateColorFromDerived() )
        this.$colorScale.preventEditing()
        updateColorFromDerived()
      }
      else {
        console.warn("%o has a color-derived-from-id of a non-existent g-color-in-palette: %s",self,this.colorDerivedFromId)
      }
    }
  }

  static tagName = "g-color-in-palette"
  static define() {
    customElements.define(this.tagName, ColorInPaletteComponent);
  }
}
HasTemplate.mixInto(ColorInPaletteComponent)
HasAttributes.mixInto(ColorInPaletteComponent)
HasEvents.mixInto(ColorInPaletteComponent)
IsCreatable.mixInto(ColorInPaletteComponent)
export default ColorInPaletteComponent
