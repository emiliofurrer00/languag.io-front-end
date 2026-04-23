export const NEO_COLOR_CLASSES = {
  teal: 'bg-neo-teal',
  blue: 'bg-neo-blue',
  coral: 'bg-neo-coral',
  magenta: 'bg-neo-magenta',
  yellow: 'bg-neo-yellow',
} as const;

export type NeoColor = keyof typeof NEO_COLOR_CLASSES;

export const NEO_COLOR_OPTIONS = [
  { name: 'Teal', id: 'teal', className: NEO_COLOR_CLASSES.teal },
  { name: 'Blue', id: 'blue', className: NEO_COLOR_CLASSES.blue },
  { name: 'Coral', id: 'coral', className: NEO_COLOR_CLASSES.coral },
  { name: 'Magenta', id: 'magenta', className: NEO_COLOR_CLASSES.magenta },
  { name: 'Yellow', id: 'yellow', className: NEO_COLOR_CLASSES.yellow },
] as const;

export function getNeoColorClass(color: string | null | undefined, fallback: NeoColor = 'teal') {
  if (color && color in NEO_COLOR_CLASSES) {
    return NEO_COLOR_CLASSES[color as NeoColor];
  }

  return NEO_COLOR_CLASSES[fallback];
}
