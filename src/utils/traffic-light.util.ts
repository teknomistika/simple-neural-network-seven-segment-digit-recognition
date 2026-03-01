
// export const lightNames = ['Red', 'Yellow', 'Green']
export const lightColorValues = [ /* red */[255, 60, 60], /* yellow */[240, 200, 0], /* green */[0, 220, 80]]
export const lightColorHexs = lightColorValues.map(v => '#' + v.map(n => n.toString(16).padStart(2, '0')).join(''))
export const ActionLabel = ['STOP < 0.25', 'WAIT < 0.75', 'GO > 0.75']

export enum Action {
  STOP,
  WAIT,
  GO
}

export function getActionCategory(y: number): Action {
  if (y < 0.25)
    return Action.STOP
  if (y < 0.75)
    return Action.WAIT
  return Action.GO
}
