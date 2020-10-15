import { is_on_board } from "./moves";
import { pawn_dir } from "./rules";


export function compute_visible(allies) {
  const visible = [];

  const make_visible = ({ x, y }) => visible[`${x} ${y}`] = true;

  allies.forEach(piece => {
    make_visible(piece.coords);
    if (piece.type === "p") {
      const ydir = pawn_dir[piece.color];
      [{
        x: piece.coords.x + 1,
        y: piece.coords.y + ydir,
      },
      {
        x: piece.coords.x - 1,
        y: piece.coords.y + ydir,
      },
      {
        x: piece.coords.x,
        y: piece.coords.y + ydir,
      }]
        .filter(is_on_board)
        .forEach(make_visible);
      if (!piece.moved) {
        const two_squares = {
          x: piece.coords.x,
          y: piece.coords.y + 2 * ydir,
        };
        if (is_on_board(two_squares))
          make_visible(two_squares);
      }
    }
    piece.moves.forEach(make_visible);
  });

  return visible;
}

const filter = [];
const width = 2;
[...Array(width * 2 + 1).keys()]
  .forEach(x =>
    [...Array(width * 2 + 1).keys()]
      .forEach(y => filter.push({ x: x - width, y: y - width })));

export function fog_strength(coords, visible) {
  return 1 -
    filter
      .map(f => ({
        x: coords.x + f.x,
        y: coords.y + f.y,
      }))
      .map(c => visible[`${c.x} ${c.y}`])
      .reduce((acc, v) => acc + Number(!!v), 0) / filter.length;
}