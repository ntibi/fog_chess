import { same_coords } from "./moves"

export const { minx, miny, maxx, maxy } = {
    minx: 0,
    miny: 0,
    maxx: 7,
    maxy: 7,
}

export const colors = ["w", "b"]

export const pieces = ["p", "n", "b", "r", "q", "k"]

export const all_pieces = pieces.map(p => colors.map(c => `${p}${c}`)).flat()

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

export function winner(pieces) {
    const kings = pieces.filter(p => p.type === king)
    if (kings.length === 1) {
        return kings[0].color
    } else if (kings.length === 0) {
        throw "wtf no kings ?"
    }
    return
}

export function apply_move(src, dst, pieces) {
    const ate = pieces.find(p => same_coords(p.coords, dst))
    pieces = pieces.filter(p => !same_coords(p.coords, dst))

    const index = pieces.findIndex(p => same_coords(p.coords, src))

    let piece = {
        ...pieces[index],
        coords: dst,
        moved: true,
    }
    if (promotable.includes(piece.type) && promote_rank.includes(piece.coords.y)) {
        piece.type = promote_to
        piece.promoted = true
    }

    if (piece.type === "k" && Math.abs(src.x - dst.x) > 1) {
        const index = pieces.findIndex(p => p.type === "r" && p.color === piece.color && Math.sign(src.x - dst.x) === Math.sign(src.x - p.coords.x))
        const castlingRook = pieces[index]

        const rook = {
            ...castlingRook,
            moved: true,
            coords: {
                x: src.x - Math.sign(src.x - castlingRook.coords.x),
                y: src.y,
            }
        }
        pieces[index] = rook
    }

    pieces[index] = piece
    return {
        pieces,
        turn: other_color(piece.color),
        ate,
        winner: winner(pieces),
    }
}