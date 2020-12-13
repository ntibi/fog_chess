import React, { useCallback, useRef, useMemo, useState } from "react";
import Tile from "./Tile";
import Piece from "./Piece";
import "./Board.css";
import { same_coords } from "../game/moves";
import { first_color, maxx, maxy } from "../game/rules";
import {
  compute_visible,
  fog_strength,
  is_visible,
  set_visible,
} from "../game/fog";
import GhostPiece from "./GhostPiece";
import { forEachTile } from "../game/tiles";
import useWindowSize from "../hooks/useWindowSize";

const cancel = (e) => {
  e.preventDefault();
  return false;
};

export default function Board({
  history,
  pieces,
  controls,
  fog_enabled,
  coords_enabled,
  turn,
  move,
}) {
  const [selected, select] = useState();

  const size = useWindowSize();
  const board = useRef(null);

  const tilesize = useMemo(() => {
    if (!board.current) return 0;
    const { clientWidth: width, clientHeight: height } = board.current;
    return Math.floor(Math.min(width / (maxx + 1), height / (maxy + 1)));
  }, [board, size]);

  const mouse_down = useCallback(
    (e) => {
      switch (e.button) {
        case 0: // left click
        case 2: // right click
          select();
          break;
      }
    },
    [select]
  );

  const last = useMemo(() => history[history.length - 1], [history]);

  const allies = useMemo(
    () => pieces.filter((piece) => piece.color === controls),
    [pieces, controls]
  );

  const visible = useMemo(() => {
    const visible = compute_visible(allies);
    if (last.ate) set_visible(last.ate.coords, visible);
    return visible;
  }, [last, allies]);

  const { tiles, pos_to_coords, coords_to_pos } = useMemo(() => {
    const _pos_to_coords = {};
    const _coords_to_pos = {};
    const pos_to_coords = (v) => _pos_to_coords[`${v.x} ${v.y}`];
    const coords_to_pos = (v) => _coords_to_pos[`${v.x} ${v.y}`];

    const tiles = [];

    forEachTile(maxx, maxy, (x, y) => {
      const coords = { x, y };
      let highlighted = false;
      const pos =
        controls === first_color
          ? coords
          : { x: maxy - coords.x, y: maxy - coords.y };
      _pos_to_coords[`${pos.x} ${pos.y}`] = coords;
      _coords_to_pos[`${coords.x} ${coords.y}`] = pos;

      if (
        (selected && same_coords(selected.coords, coords)) ||
        (last.move && same_coords(coords, last.move.dst))
      )
        highlighted = true;
      tiles.push(
        <Tile
          key={`${x} ${y}`}
          coords={coords}
          pos={pos}
          tilesize={tilesize}
          color={!((x + y) % 2) ? "light" : "dark"}
          visible={!fog_enabled || is_visible(coords, visible)}
          fog_strength={fog_strength(coords, visible)}
          visible_coords={coords_enabled}
          highlighted={highlighted}
        />
      );
    });
    return {
      tiles,
      pos_to_coords,
      coords_to_pos,
    };
  }, [controls, selected, last, tiles, tilesize, coords_enabled]);

  const pieces_to_render = useMemo(
    () =>
      (fog_enabled
        ? pieces.filter((piece) => is_visible(piece.coords, visible))
        : pieces
      ).map((piece) => (
        <Piece
          key={piece.id}
          type={piece.type}
          color={piece.color}
          tilesize={tilesize}
          coords={piece.coords}
          pos={coords_to_pos(piece.coords)}
          pos_to_coords={pos_to_coords}
          coords_to_pos={coords_to_pos}
          moves={piece.moves}
          movable={turn === piece.color && piece.color === controls}
          selected={selected && selected.id === piece.id}
          select={() => select(piece)}
          deselect={() => select()}
          owner={piece.color === controls}
          move={(dst) => move(piece.coords, dst)}
        />
      )),
    [
      fog_enabled,
      pieces,
      visible,
      tilesize,
      coords_to_pos,
      pos_to_coords,
      turn,
      controls,
      selected,
      select,
    ]
  );

  const ghost_pieces = useMemo(() => {
    const out = [];
    if (history.length < 2 || turn !== controls) return [];
    const { pieces: prev_pieces } = history[history.length - 2];
    const prev_allies = prev_pieces.filter((piece) => piece.color === controls);
    const prev_visible = compute_visible(prev_allies);
    prev_pieces.forEach((prev_piece) => {
      if (
        prev_piece.color !== turn &&
        is_visible(prev_piece.coords, prev_visible)
      ) {
        const new_pos_piece = pieces.find((x) => x.id === prev_piece.id);
        if (new_pos_piece && !is_visible(new_pos_piece.coords, visible)) {
          out.push({
            ...prev_piece,
            pos: coords_to_pos(prev_piece.coords),
          });
        }
      }
    });
    return out;
  }, [history, controls, turn]);

  return (
    <div ref={board} className="board-wrapper">
      <div
        className="board"
        onMouseDown={mouse_down}
        onContextMenu={cancel}
        style={{
          width: `${tilesize * (maxx + 1)}px`,
          height: `${tilesize * (maxy + 1)}px`,
        }}
      >
        {tiles}
        {pieces_to_render}
        {ghost_pieces.map((x) => (
          <GhostPiece
            type={x.type}
            color={x.color}
            tilesize={tilesize}
            pos={x.pos}
            key={x.id}
          />
        ))}
      </div>
    </div>
  );
}
