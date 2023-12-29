import Color from "../dataTypes/Color"
import ColorName from "../dataTypes/ColorName"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"
import IsCreatable from "../brutaldom/IsCreatable"
import Button from "./Button"
import ColorNameInputComponent from "./ColorNameInputComponent"
import RichString from "../brutaldom/RichString"

class ColorInPaletteComponent extends HTMLElement {
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
    }
  }

  static events = {
    removed: {},
    changed: {},
    colorsAdded: {},
    nameChanged: {},
  }

  afterAppendTemplate({locator}) {
    this.$analogousButton = Button.wrap(locator.$e("button[data-analogous]"))
    this.$analogousButton.onClick( () => this.dispatchColorsAdded("analogous") )

    this.$colorScale = locator.$e("g-color-scale")
    this.$colorScale.onBaseColorChange( (event) => this.dispatchChanged(event.detail) )
    this.$colorScale.onBaseColorChange( (event) => this.setAttribute("hex-code",event.detail) )

    this.$complementButton = Button.wrap(locator.$e("button[data-complement]"))
    this.$complementButton.onClick( () => this.dispatchColorsAdded("complement") )

    this.$removeButton = Button.wrap(locator.$e("button[data-remove]"))
    this.$removeButton.onClick( () => this.dispatchRemoved(event.detail) )

    this.$splitComplementButton = Button.wrap(locator.$e("button[data-split-complement]"))
    this.$splitComplementButton.onClick( () => this.dispatchColorsAdded("splitComplements") )

    this.$triadButton = Button.wrap(locator.$e("button[data-triad]"))
    this.$triadButton.onClick( () => this.dispatchColorsAdded("triad") )

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
  clearColor() {
    this.removeAttribute("hex-code")
    this.removeAttribute("user-color-name")
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
