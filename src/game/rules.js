import { same_coords } from "./moves"

export const { minx, miny, maxx, maxy } = {
    minx: 0,
    miny: 0,
    maxx: 7,
    maxy: 7,
}

export const colors = ["w", "b"]

export const first_color = colors[0]

export const other_color = (color) => colors[(colors.indexOf(color) + 1) % colors.length]

export const pawn_dir = {
    w: -1,
    b: 1,
}

export function apply_move(src, dst, pieces) {
    const piece = pieces.find(p => same_coords(p.coords, src))
    const ate = pieces.find(p => same_coords(p.coords, dst))
    pieces = pieces.filter(p => !same_coords(p.coords, dst))
    piece.coords = dst
    piece.moved = true
    return {
        pieces,
        turn: other_color(piece.color),
        ate,
    }
}