import cloneDeep from "lodash/cloneDeep"
import { moves } from "./moves"
import { apply_move, other_color } from "./rules"

const log = (args) => console.log("[engine] ", args)

const value = {
    k: 9999,
    n: 3,
    b: 3,
    q: 9,
    r: 5,
    p: 1,
}

let nodes = 0

function evaluate(pieces, player) { // TODO handle victory condition
    nodes++
    const allies = pieces.filter(piece => piece.color === player)
    const enemies = pieces.filter(piece => piece.color !== player)

    const positive = allies.map(piece => value[piece.type]).reduce((acc, v) => acc + v, 0)
    const negative = enemies.map(piece => value[piece.type]).reduce((acc, v) => acc + v, 0)

    return positive - negative
}

function best_move(pieces, player, depth) {
    if (!depth)
        return {
            value: evaluate(pieces, player)
        }

    let best = {
        move: {},
        value: -Infinity,
    }

    for (let piece of pieces.filter(piece => piece.color === player)) {
        for (let move of piece.moves) {
            // TODO apply_move doit pas modifier les pieces sinon ca casse tout (et les cloneDeep ca consomme)
            let { pieces: new_pieces } = apply_move(piece.coords, move, cloneDeep(pieces))
            new_pieces = new_pieces.map(p => ({
                ...p,
                moves: moves(p, new_pieces)
            }))
            let { value, move: next } = best_move(new_pieces, other_color(player), depth - 1)
            value = -value
            if (value > best.value) {
                best = {
                    move: {
                        src: piece.coords,
                        dst: move,
                        next: {
                            depth: depth - 1,
                            color: other_color(player),
                            value: value,
                            move: next,
                        },
                    },
                    value,
                }
            }
        }
    }

    return best 
}

onmessage = ({data: {turn, pieces}}) => {
    nodes = 0
    const t0 = performance.now()

    const player = turn
    pieces = cloneDeep(pieces)
    const allies = pieces.filter(piece => piece.color === player)
    const enemies = pieces.filter(piece => piece.color !== player)
    const initial = evaluate(pieces, player)

    const { move, value } = best_move(pieces, player, 2)
    console.log(JSON.stringify(move, null, 4))

    const t1 = performance.now()
    const elapsed = t1 - t0
    log(`moving for ${value} Δ(${value - initial}) (${elapsed}ms) (${nodes} nodes, ${Math.floor(nodes / elapsed * 1000)}n/s)`)

    postMessage(move)
}