import React, { useState, useRef } from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import "./Board.css";
import { same_coords } from "../game/moves";
import { maxx, maxy } from "../game/rules";
import { compute_visible, fog_strength, is_visible, set_visible } from "../game/fog";
import GhostPiece from "./GhostPiece";
import { forEachTile } from "../game/tiles";
import useWindowSize from "../hooks/useWindowSize";

export default function Board(props) {
  const [selected, select] = useState();

  const size = useWindowSize();
  const tilesize = Math.floor((Math.min(size.width, size.height) / 10));
  const origin = useRef(null);

  const mouse_down = (e) => {
    switch (e.button) {
    case 0: // left click
    case 2: // right click
      select();
      break;
    }
  };

  const cancel = (e) => {
    e.preventDefault();
    return false;
  };

  const last = props.history[props.history.length - 1];

  const allies = props.pieces.filter(piece => piece.color === props.controls);
  const visible = compute_visible(allies);
  if (last.ate)
    set_visible(last.ate.coords, visible);

  const pieces_to_render = (props.fog ?
    props.pieces.filter(piece => is_visible(piece.coords, visible)) :
    props.pieces)
    .map(piece => <Piece
      key={piece.id}
      type={piece.type}
      color={piece.color}
      tilesize={tilesize}
      coords={piece.coords}
      moves={piece.moves}
      movable={props.turn === piece.color && piece.color === props.controls}
      selected={selected && selected.id === piece.id}
      select={() => select(piece)}
      deselect={() => select()}
      owner={piece.color === props.controls}
      origin={origin}
      move={(dst) => props.move(piece.coords, dst)}
    />);

  const tiles = [];

  forEachTile(maxx, maxy, (x, y) => {
    const coords = { x, y };
    let highlighted = false;
    if ((selected && same_coords(selected.coords, coords)) || (last.move && same_coords(coords, last.move.dst)))
      highlighted = true;
    tiles.push(
      <Tile
        key={`${x} ${y}`}
        coords={coords}
        tilesize={tilesize}
        color={!((x + y) % 2) ? "light" : "dark"}
        visible={!props.fog || is_visible(coords, visible)}
        fog_strength={fog_strength(coords, visible)}
        visible_coords={props.coords}
        highlighted={highlighted}
      />
    );
  });

  const ghost_pieces = (() => {
    const out = [];
    if (props.history.length < 2 || props.turn !== props.controls)
      return [];
    const { pieces: prev_pieces } = props.history[props.history.length - 2];
    const prev_allies = prev_pieces.filter(piece => piece.color === props.controls);
    const prev_visible = compute_visible(prev_allies);
    prev_pieces.forEach(prev_piece => {
      if (prev_piece.color !== props.turn && is_visible(prev_piece.coords, prev_visible)) {
        const new_pos = props.pieces.find(x => x.id === prev_piece.id).coords;
        if (!is_visible(new_pos, visible)) {
          out.push(prev_piece);
        }
      }
    });
    return out;
  })();

  return (
    <div
      className="board"
      style={{
        width: `${tilesize * 8}px`,
        height: `${tilesize * 8}px`,
      }}
      ref={origin}
      onMouseDown={mouse_down}
      onContextMenu={cancel}
    >
      {tiles}
      {pieces_to_render}
      {ghost_pieces.map(x => <GhostPiece
        type={x.type}
        color={x.color}
        tileSize={tilesize}
        coords={x.coords}
        key={x.id}
      />)}

    </div>
  );
}