import { is_on_board, same_coords } from "./moves"
import { pawn_dir } from "./rules"

export const is_visible = (visible, coords) => visible.some(v => same_coords(v, coords))

export function compute_visible(allies) {
    const visible = [];

    // [...Array(8 + 1).keys()].forEach(y => {
    //     [...Array(8 + 1).keys()].forEach(x => {
    //         visible.push({x, y})
    //     })})
    //     return visible

    allies.forEach(piece => {
        visible.push(piece.coords)
        if (piece.type === "p") {
            const ydir = pawn_dir[piece.color];
            visible.push(...[{
                x: piece.coords.x + 1,
                y: piece.coords.y + ydir,
            }, {
                x: piece.coords.x - 1,
                y: piece.coords.y + ydir,
            }, {
                x: piece.coords.x,
                y: piece.coords.y + ydir,
            }]
                .filter(is_on_board)
            )
            if (!piece.moved) {
                visible.push(...[{
                    x: piece.coords.x,
                    y: piece.coords.y + 2 * ydir,
                }].filter(is_on_board))
            }
        }
        visible.push(...piece.moves)
    })

    return visible.filter((v, i) => visible.findIndex(x => same_coords(v, x)) === i)
}

const filter = []
const width = 2;
[...Array(width * 2 + 1).keys()]
    .forEach(x =>
        [...Array(width * 2 + 1).keys()]
            .forEach(y => filter.push({ x: x - width, y: y - width })))

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