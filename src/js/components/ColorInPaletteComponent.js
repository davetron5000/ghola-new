import HexCode from "../dataTypes/HexCode"
import HasTemplate from "../brutaldom/HasTemplate"
import HasAttributes from "../brutaldom/HasAttributes"
import HasEvents from "../brutaldom/HasEvents"
import HasRequiredChildElements from "../brutaldom/HasRequiredChildElements"

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

  connectedCallback() {
    this._debugColorsAdded()
    this.addNodeFromTemplate({
      before: ({locator}) => {
        this.$colorScale = locator.$e("g-color-scale")
        this.$removeButton = locator.$e("button[data-remove]")
        this.$complementButton = locator.$e("button[data-complement]")
        this.$splitComplementButton = locator.$e("button[data-split-complement]")
        this.$analogousButton = locator.$e("button[data-analogous]")
        this.$triadButton = locator.$e("button[data-triad]")
      },
      after: () => {
        this.$colorScale.onBaseColorChange( (event) => this.dispatchChanged(event.detail) )
        this.$removeButton.addEventListener("click", (event) => {
          event.preventDefault()
          this.dispatchRemoved(event.detail)
        })
        this.$complementButton.addEventListener("click", (event) => {
          event.preventDefault()
          this.dispatchColorsAdded([ this.hexCode.complement() ])
        })
        this.$splitComplementButton.addEventListener("click", (event) => {
          event.preventDefault()
          this.dispatchColorsAdded(this.hexCode.splitComplements())
        })
        this.$analogousButton.addEventListener("click", (event) => {
          event.preventDefault()
          this.dispatchColorsAdded(this.hexCode.analogous())
        })
        this.$triadButton.addEventListener("click", (event) => {
          event.preventDefault()
          this.dispatchColorsAdded(this.hexCode.triad())
        })
      }
    })
  }

  disconnectedCallback() {
    this.removeEventListeners()
    this.$removeButton.removeEventListener("click", this.removeButtonClickListener)
  }

  applyLightnessFrom(colorInPalette) {
    this.$colorScale.applyLightnessFrom(colorInPalette.$colorScale)
  }
  
  _render() {
    if (!this.$element) {
      return
    }
    if (this.hexCode) {
      this.$colorScale.setAttribute("hex-code", this.hexCode.toString())
    }
    if (this.primary) {
      this.$removeButton.style.display = "none"
    }
    else {
      this.$removeButton.style.display = "block"
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
export default ColorInPaletteComponent
