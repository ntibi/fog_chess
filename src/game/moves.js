import { otherColor } from "./rules"

const { minx, miny, maxx, maxy } = {
    minx: 0,
    miny: 0,
    maxx: 7,
    maxy: 7,
}

export const same_coords = (c1, c2) => c1.x === c2.x && c1.y === c2.y

const is_on_board = (move) => move.x >= minx && move.x <= maxx && move.y >= miny && move.y <= maxy
const no_collision = (move, pieces) => !pieces.some(piece => same_coords(piece.coords, move))
const collision = (move, pieces) => pieces.some(piece => same_coords(piece.coords, move))
const apply_move = (coords, dir) => ({ x: coords.x + dir.x, y: coords.y + dir.y })

function straight_move (piece, dir, allies, ennemies) {
    const out = []
    let move = { ...piece.coords }
    while(true)
    {
        move = apply_move(move, dir)
        if (!is_on_board(move) || collision(move, allies))
            return out
        if (collision(move, ennemies))
        {
            out.push(move)
            return out
        }
        out.push(move)
    }
}

const movers = {
    k: (piece, allies) => [
        apply_move(piece.coords, { x: -1, y: -1 }),
        apply_move(piece.coords, { x: 0, y: -1 }),
        apply_move(piece.coords, { x: 1, y: -1 }),
        apply_move(piece.coords, { x: -1, y: 0 }),
        apply_move(piece.coords, { x: 1, y: 0 }),
        apply_move(piece.coords, { x: -1, y: 1 }),
        apply_move(piece.coords, { x: 0, y: 1 }),
        apply_move(piece.coords, { x: 1, y: 1 }),
    ].filter(move => is_on_board(move)).filter(move => no_collision(move, allies)),
    n: (piece, allies) => [
        apply_move(piece.coords, { x: -1, y: -2 }),
        apply_move(piece.coords, { x: 1, y: -2 }),
        apply_move(piece.coords, { x: 2, y: -1 }),
        apply_move(piece.coords, { x: 2, y: 1 }),
        apply_move(piece.coords, { x: 1, y: 2 }),
        apply_move(piece.coords, { x: -1, y: 2 }),
        apply_move(piece.coords, { x: -2, y: -1 }),
        apply_move(piece.coords, { x: -2, y: 1 }),
    ].filter(move => is_on_board(move)).filter(move => no_collision(move, allies)),
    p: (piece, allies, ennemies) => {
        const ydir = piece.color === "w" ? -1 : 1
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
        if (no_collision(first, allies.concat(ennemies))) {
            out.push(first)
            if (!piece.moved && no_collision(second, allies.concat(ennemies)))
                out.push(second)
        }
        out.push(...sides.filter(side => collision(side, ennemies)))
        return out;
    },
    r: (piece, allies, ennemies) => [
        ...straight_move(piece, {x: 1, y: 0}, allies, ennemies),
        ...straight_move(piece, {x: -1, y: 0}, allies, ennemies),
        ...straight_move(piece, {x: 0, y: 1}, allies, ennemies),
        ...straight_move(piece, {x: 0, y: -1}, allies, ennemies),
    ],
    b: (piece, allies, ennemies) => [
        ...straight_move(piece, {x: 1, y: 1}, allies, ennemies),
        ...straight_move(piece, {x: 1, y: -1}, allies, ennemies),
        ...straight_move(piece, {x: -1, y: 1}, allies, ennemies),
        ...straight_move(piece, {x: -1, y: -1}, allies, ennemies),
    ],
    q: (piece, allies, ennemies) => [
        ...straight_move(piece, {x: 1, y: 0}, allies, ennemies),
        ...straight_move(piece, {x: -1, y: 0}, allies, ennemies),
        ...straight_move(piece, {x: 0, y: 1}, allies, ennemies),
        ...straight_move(piece, {x: 0, y: -1}, allies, ennemies),
        ...straight_move(piece, {x: 1, y: 1}, allies, ennemies),
        ...straight_move(piece, {x: 1, y: -1}, allies, ennemies),
        ...straight_move(piece, {x: -1, y: 1}, allies, ennemies),
        ...straight_move(piece, {x: -1, y: -1}, allies, ennemies),
    ],
}

export function moves(piece, pieces) {
    const mover = movers[piece.type]
    const allies = pieces.filter(p => p.color === piece.color)
    const ennemies = pieces.filter(p => p.color === otherColor(piece.color))
    return mover(piece, allies, ennemies)
}