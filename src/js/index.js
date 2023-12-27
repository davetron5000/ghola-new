import HexCodeComponent              from "./components/HexCodeComponent"
import ColorSwatchInputComponent     from "./components/ColorSwatchInputComponent"
import EditableColorSwatchComponent  from "./components/EditableColorSwatchComponent"
import ColorNameComponent            from "./components/ColorNameComponent"
import ColorScaleComponent           from "./components/ColorScaleComponent"
import ButtonAccentEnhancement       from "./components/enhancements/ButtonAccentEnhancement"
import ColorInPaletteComponent       from "./components/ColorInPaletteComponent"
import PaletteComponent              from "./components/PaletteComponent"

document.addEventListener("DOMContentLoaded", () => {
  HexCodeComponent.define()
  ColorSwatchInputComponent.define()
  EditableColorSwatchComponent.define()
  ColorNameComponent.define()
  ColorScaleComponent.define()
  ButtonAccentEnhancement.define()
  ColorInPaletteComponent.define()
  PaletteComponent.define()
})
