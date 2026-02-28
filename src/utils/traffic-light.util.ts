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
const offMap = [
  /* red */   'radial-gradient(circle at 40% 35%, #3d1a1a, #200d0d)',
  /* yellow */'radial-gradient(circle at 40% 35%, #2e2510, #180f05)',
  /* green */ 'radial-gradient(circle at 40% 35%, #0e2a18, #061208)',
]
export function trafficLightStyle(brightness: number, colorIndex: number) {
  if (!brightness || brightness <= 0.09) {
    return {
      background: offMap[colorIndex],
      boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.5)',
    }
  }

  const [r, g, bl] = lightGlows[colorIndex];
  const glowRadius = Math.round(5 + brightness * 5);
  const spread = Math.round(brightness);

  return {
    background: `radial-gradient(circle at 40% 35%,
          rgba(${r},${g},${bl}, ${0.4 + brightness * 0.6}) 0%,
          rgba(${Math.round(r * 0.7)},${Math.round(g * 0.7)},${Math.round(bl * 0.7)}, ${0.8 + brightness * 0.2}) 60%,
          rgba(${Math.round(r * 0.3)},${Math.round(g * 0.3)},${Math.round(bl * 0.3)}, 1) 100%
        )`,
    boxShadow: `
          inset 0 3px 10px rgba(0,0,0,0.3),
          0 0 ${glowRadius}px ${spread}px rgba(${r},${g},${bl}, ${brightness * 0.9}),
          0 0 ${Math.round(glowRadius * 2)}px rgba(${r},${g},${bl}, ${brightness * 0.4})
        `,
    filter: `brightness(${0.3 + brightness * 0.7})`,
  };
}

export function glowController(colorIndex: number, el: SVGElement, setValue = 0) {
  const value = ref(setValue)
  const [r, g, b] = lightGlows[colorIndex];
  el.style.fill = `rgb(${r},${g},${b})`
  watch(value, v => {
    el.style.opacity = (0.1 + 0.9 * v).toFixed(2) //`brightness(${0.3 + v * 0.7})`
  }, { immediate: true })
  return value

}