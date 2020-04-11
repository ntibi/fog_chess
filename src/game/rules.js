export const colors = ["w", "b"]

export const firstColor = colors[0]

export const otherColor = (color) => colors[(colors.indexOf(color) + 1) % colors.length]
