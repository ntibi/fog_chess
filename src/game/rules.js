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

export const promotable = ["p"]
export const promote_to = "q"

export const promote_rank = [0, 7]

export const king = "k"

export function apply_move(src, dst, pieces) {
    const piece = pieces.find(p => same_coords(p.coords, src))
    const ate = pieces.find(p => same_coords(p.coords, dst))
    let winner

    pieces = pieces.filter(p => !same_coords(p.coords, dst))
    piece.coords = dst
    piece.moved = true
    if (promotable.includes(piece.type) && promote_rank.includes(piece.coords.y)) {
        piece.type = promote_to
        piece.promoted = true
    }
    if (ate && ate.type === king) {
        winner = other_color(ate.color)
    }
    return {
        pieces,
        turn: other_color(piece.color),
        ate,
        winner,
    }
}