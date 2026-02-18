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
