import { is_on_board } from "./moves"
import { pawn_dir } from "./rules"

export function compute_visible(allies) {
    const visible = []

    allies.forEach(piece => {
        if (visible.indexOf(piece.coords) === -1)
            visible.push(piece.coords)
        if (piece.type === "p") {
            const ydir = pawn_dir[piece.color];
            visible.push(...[{
                x: piece.coords.x + 1,
                y: piece.coords.y + ydir,
            }, {
                x: piece.coords.x,
                y: piece.coords.y + ydir,
            }, {
                x: piece.coords.x - 1,
                y: piece.coords.y + ydir,
            }]
                .filter(move => is_on_board(move))
                .filter(move => visible.indexOf(move) === -1)
            )
        }
        piece.moves
            .forEach(move => visible.indexOf(move) === -1 && visible.push(move))
    })
    return visible
}

export function fog_distance(coords, allies) {
    if (!allies.length)
        return false
    return Math.min(...allies.map(piece => {
        const dx = coords.x - piece.coords.x;
        const dy = coords.y - piece.coords.y;

        return Math.sqrt(dx * dx + dy * dy);
    }))
}