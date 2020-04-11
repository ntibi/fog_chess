import { same_coords } from "./moves"

export const colors = ["w", "b"]

export const first_color = colors[0]

export const other_color = (color) => colors[(colors.indexOf(color) + 1) % colors.length]

export function apply_move(src, dst, pieces) {
    const piece = pieces.find(p => same_coords(p.coords, src))
    pieces = pieces.filter(p => !same_coords(p.coords, dst))
    piece.coords = dst
    piece.moved = true
    return {
        pieces,
        turn: other_color(piece.color)
    }
}