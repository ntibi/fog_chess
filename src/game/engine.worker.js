import cloneDeep from "lodash/cloneDeep"
import moves from "./moves"
import { apply_move } from "./rules"

const log = (args) => console.log("[engine] ", args)

const value = {
    k: 9999,
    n: 3,
    b: 3,
    q: 9,
    r: 5,
    p: 1,
}

function evaluate(pieces, player) {
    const allies = pieces.filter(piece => piece.color === player)
    const enemies = pieces.filter(piece => piece.color !== player)

    const positive = allies.map(piece => value[piece.type]).reduce((acc, v) => acc + v, 0)
    const negative = enemies.map(piece => value[piece.type]).reduce((acc, v) => acc + v, 0)

    log(positive - negative)

    return positive - negative
}

function best_move(pieces, player) {
    let best_move = {}
    let best_value = -Infinity

    for (let piece of pieces.filter(piece => piece.color === player)) {
        for (let move of piece.moves) {
            // TODO apply_move doit pas modifier les pieces sinon ca casse tout (et les cloneDeep ca consomme)
            const { pieces: new_pieces } = apply_move(piece.coords, move, cloneDeep(pieces))
            const value_diff = evaluate(new_pieces, player)
            if (value_diff > best_value) {
                best_move = {
                    src: piece.coords,
                    dst: move,
                }
                best_value = value_diff
            }
        }
    }

    return best_move
}

onmessage = ({data: {turn, pieces}}) => {
    const player = turn
    pieces = cloneDeep(pieces)
    const allies = pieces.filter(piece => piece.color === player)
    const enemies = pieces.filter(piece => piece.color !== player)

    const move = best_move(pieces, player)

    postMessage(move)
}