import HexCode from "../dataTypes/HexCode"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"
import HasRequiredChildElements from "../brutaldom/HasRequiredChildElements"
import IsCreatable from "../brutaldom/IsCreatable"
import Button from "./Button"

class ColorInPaletteComponent extends HTMLElement {
  static attributeListeners = {
    "hex-code": {
      value: HexCode,
    },
    "primary": {
      value: (x) => x === "true"
    }
  }

  static events = {
    removed: {},
    changed: {},
    colorsAdded: {},
  }

  afterAppendTemplate({locator}) {
    this.$analogousButton = Button.wrap(locator.$e("button[data-analogous]"))
    this.$analogousButton.onClick( () => this.dispatchColorsAdded(this.hexCode.analogous()) )

    this.$colorScale = locator.$e("g-color-scale")
    this.$colorScale.onBaseColorChange( (event) => this.dispatchChanged(event.detail) )

    this.$complementButton = Button.wrap(locator.$e("button[data-complement]"))
    this.$complementButton.onClick( () => this.dispatchColorsAdded([ this.hexCode.complement() ]) )

    this.$removeButton = Button.wrap(locator.$e("button[data-remove]"))
    this.$removeButton.onClick( () => this.dispatchRemoved(event.detail) )

    this.$splitComplementButton = Button.wrap(locator.$e("button[data-split-complement]"))
    this.$splitComplementButton.onClick( () => this.dispatchColorsAdded(this.hexCode.splitComplements()) )

    this.$triadButton = Button.wrap(locator.$e("button[data-triad]"))
    this.$triadButton.onClick( () => this.dispatchColorsAdded(this.hexCode.triad()) )
  }

  disconnectedCallback() {
    this.removeEventListeners()
    this.$removeButton.disconnectedCallback()
  }

  updateHexCode(hexCode) {
    this.setAttribute("hex-code",hexCode.toString())
  }

  render() {
    if (!this.$element) {
      return
    }
    if (this.hexCode) {
      this.$colorScale.updateBaseColor(this.hexCode)
    }
    if (this.primary) {
      this.$removeButton.hide()
    }
    else {
      this.$removeButton.show()
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
