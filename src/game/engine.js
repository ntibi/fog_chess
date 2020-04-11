export function get_move(pieces, turn) {
    const allies = pieces.filter(piece => piece.color === turn)
    const enemies = pieces.filter(piece => piece.color !== turn)

    const available = allies.filter(piece => piece.moves.length > 0)
    const piece = available[Math.floor(Math.random() * available.length)];
    const move = piece.moves[Math.floor(Math.random() * piece.moves.length)];
    return {
        src: piece.coords,
        dst: move,
    }
}