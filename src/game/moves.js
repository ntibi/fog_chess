import { other_color, minx, maxx, miny, maxy, pawn_dir } from "./rules"

export const same_coords = (c1, c2) => c1.x === c2.x && c1.y === c2.y

export const is_on_board = (move) => move.x >= minx && move.x <= maxx && move.y >= miny && move.y <= maxy
export const no_collision = (move, pieces) => !pieces.some(piece => same_coords(piece.coords, move))
export const collision = (move, pieces) => pieces.some(piece => same_coords(piece.coords, move))
export const apply = (coords, dir) => ({ x: coords.x + dir.x, y: coords.y + dir.y })

function straight_move(piece, dir, allies, enemies) {
    const out = []
    let move = { ...piece.coords }
    while(true)
    {
        move = apply(move, dir)
        if (!is_on_board(move) || collision(move, allies))
            return out
        if (collision(move, enemies))
        {
            out.push(move)
            return out
        }
        out.push(move)
    }
}

function castle(piece, allies, enemies) {
    const out = []

    if (!piece.moved) {
        allies.filter(x => x.type === "r").forEach(rook => {
            if (!rook.moved) {
                const dir = Math.sign(rook.coords.x - piece.coords.x)
                let blocked = false
                for (let i = piece.coords.x + dir; i !== rook.coords.x; i += dir) {
                    if (!no_collision({ x: i, y: piece.coords.y }, allies.concat(enemies)))
                        blocked = true
                }
                if (!blocked)
                    out.push(apply(piece.coords, { x: 2 * dir, y: 0 }))
            }
        })
    }
    return out
}

const movers = {
    k: (piece, allies, enemies) => [
        apply(piece.coords, { x: -1, y: -1 }),
        apply(piece.coords, { x: 0, y: -1 }),
        apply(piece.coords, { x: 1, y: -1 }),
        apply(piece.coords, { x: -1, y: 0 }),
        apply(piece.coords, { x: 1, y: 0 }),
        apply(piece.coords, { x: -1, y: 1 }),
        apply(piece.coords, { x: 0, y: 1 }),
        apply(piece.coords, { x: 1, y: 1 }),
        ...castle(piece, allies, enemies),
    ]
    .filter(move => is_on_board(move))
    .filter(move => no_collision(move, allies))
    ,
    n: (piece, allies) => [
        apply(piece.coords, { x: -1, y: -2 }),
        apply(piece.coords, { x: 1, y: -2 }),
        apply(piece.coords, { x: 2, y: -1 }),
        apply(piece.coords, { x: 2, y: 1 }),
        apply(piece.coords, { x: 1, y: 2 }),
        apply(piece.coords, { x: -1, y: 2 }),
        apply(piece.coords, { x: -2, y: -1 }),
        apply(piece.coords, { x: -2, y: 1 }),
    ]
    .filter(move => is_on_board(move))
    .filter(move => no_collision(move, allies))
    ,
    p: (piece, allies, enemies) => {
        const ydir = pawn_dir[piece.color]
        const out = []
        const first = {
            x: piece.coords.x,
            y: piece.coords.y + ydir,
        }
        const second = {
            x: piece.coords.x,
            y: piece.coords.y + 2 * ydir,
        }
        const sides = [
            {
                x: piece.coords.x - 1,
                y: piece.coords.y + ydir,
            },
            {
                x: piece.coords.x + 1,
                y: piece.coords.y + ydir,
            },
        ]
        if (is_on_board(first) && no_collision(first, allies.concat(enemies))) {
            out.push(first)
            if (!piece.moved && is_on_board(second) && no_collision(second, allies.concat(enemies)))
                out.push(second)
        }
        out.push(...sides.filter(side => collision(side, enemies)))
        return out;
    },
    r: (piece, allies, enemies) => [
        ...straight_move(piece, {x: 1, y: 0}, allies, enemies),
        ...straight_move(piece, {x: -1, y: 0}, allies, enemies),
        ...straight_move(piece, {x: 0, y: 1}, allies, enemies),
        ...straight_move(piece, {x: 0, y: -1}, allies, enemies),
    ],
    b: (piece, allies, enemies) => [
        ...straight_move(piece, {x: 1, y: 1}, allies, enemies),
        ...straight_move(piece, {x: 1, y: -1}, allies, enemies),
        ...straight_move(piece, {x: -1, y: 1}, allies, enemies),
        ...straight_move(piece, {x: -1, y: -1}, allies, enemies),
    ],
    q: (piece, allies, enemies) => [
        ...straight_move(piece, {x: 1, y: 0}, allies, enemies),
        ...straight_move(piece, {x: -1, y: 0}, allies, enemies),
        ...straight_move(piece, {x: 0, y: 1}, allies, enemies),
        ...straight_move(piece, {x: 0, y: -1}, allies, enemies),
        ...straight_move(piece, {x: 1, y: 1}, allies, enemies),
        ...straight_move(piece, {x: 1, y: -1}, allies, enemies),
        ...straight_move(piece, {x: -1, y: 1}, allies, enemies),
        ...straight_move(piece, {x: -1, y: -1}, allies, enemies),
    ],
}

export function moves(piece, pieces) {
    const mover = movers[piece.type]
    const allies = pieces.filter(p => p.color === piece.color)
    const enemies = pieces.filter(p => p.color === other_color(piece.color))
    return mover(piece, allies, enemies)
}