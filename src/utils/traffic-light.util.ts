import { ref, watch } from "vue"

export enum Action {
  STOP,
  WAIT,
  GO
}
export const ActionLabel = ['STOP < 0.25', 'WAIT < 0.75', 'GO > 0.75']
// export const lightNames = ['Red', 'Yellow', 'Green']
export const lightColors = [/* red */ '#ff3232',/* yellow */ '#ffc800',/* green */ '#00dc50']

export function getActionCategory(y: number): Action {
  if (y < 0.25)
    return Action.STOP
  if (y < 0.75)
    return Action.WAIT
  return Action.GO
}

const lightGlows = [ /* red */[255, 60, 60], /* yellow */[240, 200, 0], /* green */[0, 220, 80]]


export function glowController(colorIndex: number, el: SVGElement, setValue = 0) {
  const value = ref(setValue)
  const [r, g, b] = lightGlows[colorIndex];
  el.style.fill = `rgb(${r},${g},${b})`
  watch(value, v => {
    el.style.opacity = (0.1 + 0.9 * v).toFixed(2) //`brightness(${0.3 + v * 0.7})`
  }, { immediate: true })
  return value

}