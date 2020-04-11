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

export function compute_visible(pieces, color) {
    const visible = []
    const allies = pieces.filter(piece => piece.color === color)

    allies.forEach(piece => {
        if (visible.indexOf(piece.coords) === -1)
            visible.push(piece.coords)
        piece.moves.forEach(move =>
            visible.indexOf(move) === -1 && visible.push(move)
        )
    })
    return visible
}