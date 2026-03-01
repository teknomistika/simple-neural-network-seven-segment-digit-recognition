import { lightColorValues } from "@/utils/traffic-light.util";
import { ref, watch } from "vue"


export function useGlowController(colorIndex: number, el: SVGElement, setValue = 0) {
  const value = ref(setValue)
  const [r, g, b] = lightColorValues[colorIndex];
  el.style.fill = `rgb(${r},${g},${b})`
  watch(value, v => {
    el.style.opacity = (0.1 + 0.9 * v).toFixed(2) //`brightness(${0.3 + v * 0.7})`
  }, { immediate: true })
  return value

}