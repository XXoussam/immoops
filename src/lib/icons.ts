/* Brand marks HugeIcons doesn't ship, drawn on its 24×24 stroke grid so <HugeiconsIcon> renders them like any other icon */

const stroke = { stroke: 'currentColor', strokeWidth: '1.5' }

/* n8n logo: two nodes in a row, then a fork into two */
export const N8nIcon = [
  ['circle', { cx: '3.6', cy: '12', r: '2.1', ...stroke, key: '0' }],
  ['circle', { cx: '9.9', cy: '12', r: '2.1', ...stroke, key: '1' }],
  ['circle', { cx: '20.4', cy: '7', r: '2.1', ...stroke, key: '2' }],
  ['circle', { cx: '18.2', cy: '17', r: '2.1', ...stroke, key: '3' }],
  ['path', { d: 'M5.7 12H7.8', ...stroke, key: '4' }],
  ['path', { d: 'M12 12H12.6C13.6 12 13.8 11 14 9.6C14.2 8 14.8 7 16.2 7H18.3', ...stroke, key: '5' }],
  ['path', { d: 'M12.6 12C13.6 12 13.8 13 14 14.4C14.2 16 14.8 17 15.3 17H16.1', ...stroke, key: '6' }],
] as const
