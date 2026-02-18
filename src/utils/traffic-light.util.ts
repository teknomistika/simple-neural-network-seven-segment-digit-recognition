export enum Action {
  STOP,
  WAIT,
  GO
}
// export const lightNames = ['Red', 'Yellow', 'Green']
export const lightColors = [/* red */ '#ff3232',/* yellow */ '#ffc800',/* green */ '#00dc50']

export function getActionCategory(y: number): Action {
  if (y < 0.3)
    return Action.STOP
  if (y < 0.6)
    return Action.WAIT
  return Action.GO
}
