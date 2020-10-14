import React, { useState, useRef } from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import "./Board.css";
import { same_coords } from "../game/moves";
import { maxx, maxy } from "../game/rules";
import { compute_visible, fog_strength } from "../game/fog";
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

  const allies = props.pieces.filter(piece => piece.color === props.controls);
  const visible = compute_visible(allies);

  const pieces_to_render = (props.fog ?
    props.pieces.filter(piece => visible[`${piece.coords.x} ${piece.coords.y}`]) :
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
    if (selected && same_coords(selected.coords, coords))
      highlighted = true;
    tiles.push(
      <Tile
        key={`${x} ${y}`}
        coords={coords}
        tilesize={tilesize}
        color={!((x + y) % 2) ? "light" : "dark"}
        visible={!props.fog || visible[`${x} ${y}`]}
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
    Object.values(prev_visible).forEach(tile => {
      const piece = prev_pieces.find(p => same_coords(p.coords, tile));
      if (piece && piece.color !== props.turn) {
        const new_pos = props.pieces.find(x => x.id === piece.id).coords;
        if (!visible[`${new_pos.x} ${new_pos.y}`]) {
          out.push(piece);
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