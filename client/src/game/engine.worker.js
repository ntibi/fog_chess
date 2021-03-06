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

function shannon_mobility(pieces, player) {
    // TODO https://www.chessprogramming.org/Evaluation add pawn evaluation
    return pieces.reduce((acc, piece) => acc + piece.moves.length * (piece.color === player ? 0.1 : -0.1), 0)
}

function evaluate(pieces, player) {
    let score = 0

    for (let piece of pieces) {
        if (piece.color === player)
            score += value[piece.type]
        else
            score -= value[piece.type]
    }
    return score + shannon_mobility(pieces, player)
}

let nodes = 0

function min_max(pieces, player, depth, { alpha, beta }) {
    if (!depth) {
        nodes++
        return {
            value: evaluate(pieces, player)
        }
    }

    let best = {
        move: {},
        value: -Infinity,
    }

    const available_moves = []
    for (let piece of pieces.filter(piece => piece.color === player)) {
        for (let move of piece.moves) {
            const applied = apply_move(piece.coords, move, pieces)
            available_moves.push([piece, move, applied, evaluate(applied.pieces, player)])
        }
    }

    available_moves.sort(([p1, m1, a1, e1], [p2, m2, a2, e2]) => e2 - e1 )

    for (let [piece, move, applied] of available_moves) {
        let { pieces: new_pieces, winner } = applied
        new_pieces = new_pieces.map(p => ({
            ...p,
            moves: moves(p, new_pieces)
        }))
        let value, next
        if (!winner) {
            let mm = min_max(new_pieces, other_color(player), depth - 1, { alpha: -beta, beta: -alpha })
            value = -mm.value
            next = mm.move
        } else {
            value = winner === player ? Infinity : -Infinity
        }
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
        alpha = Math.max(alpha, best.value)
        if (alpha >= beta)
            break;
    }

    return best 
}

function best_move(pieces, player, level) {
    return min_max(pieces, player, level, { alpha: -Infinity, beta: Infinity })
}

onmessage = ({data: {turn, pieces, level}}) => {
    nodes = 0
    const t0 = performance.now()

    const player = turn
    const initial = evaluate(pieces, player)

    const { move, value } = best_move(pieces, player, level)

    const t1 = performance.now()
    const elapsed = t1 - t0
    log(`moving for ${value} Δ(${value - initial}) (${elapsed}ms) (${nodes} nodes, ${Math.floor(nodes / elapsed * 1000)}n/s)`)

    postMessage(move)
}