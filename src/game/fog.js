import { is_on_board, same_coords } from "./moves"
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

const filter = []
const width = 2;
[...Array(width * 2 + 1).keys()]
    .forEach(x =>
        [...Array(width * 2 + 1).keys()]
            .forEach(y => filter.push({ x: x - width, y: y - width })))
console.log(filter)

export function fog_strength(coords, visible_tiles) {
    return 1 -
    filter
    .map(f => ({
        x: coords.x + f.x,
        y: coords.y + f.y,
    }))
    .map(c => visible_tiles.find(tc => same_coords(tc, c)))
    .reduce((acc, v) => acc + Number(!!v), 0) / filter.length
}