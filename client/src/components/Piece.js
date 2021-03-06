import React, { useCallback, useEffect, useState } from "react";
import pieces from "./Pieces";
import "./Piece.css";
import Draggable from "react-draggable";
import clamp from "../utils/clamp";
import { same_coords } from "../game/moves";
import Hint from "./Hint";
import newId from "../utils/newId";
import { minx, maxx, miny, maxy } from "../game/rules";

export default function Piece({ coords, pos, pos_to_coords, coords_to_pos, tilesize, color, type, moves, selected, select, deselect, move, movable }) {
  const [ double_select, set_double_select ] = useState(false);

  const default_position = { x: pos.x * tilesize, y: pos.y * tilesize };
  const [ position, set_position ] = useState(default_position);

  const style = {
    width: `${tilesize}px`,
    height: `${tilesize}px`,
  };

  useEffect(() => {
    set_position(default_position);
  }, [coords, pos, tilesize]);

  const get_dropped_coords = useCallback(() => {
    const dropped = {
      x: position.x + tilesize / 2,
      y: position.y + tilesize / 2,
    };

    return pos_to_coords({
      x: clamp(parseInt(dropped.x / tilesize), minx, maxx),
      y: clamp(parseInt(dropped.y / tilesize), miny, maxy),
    });
  }, [position]);

  const start = useCallback(() => {
    if (!movable)
      return;

    if (selected) {
      set_double_select(true);
    }
    select();
  }, [movable, selected, set_double_select, select]);
    
  const stop = useCallback((e) => {
    const destination = get_dropped_coords(e);

    if (!movable) {
      set_position(default_position);
    } else if (same_coords(destination, coords)) {
      if (double_select) {
        deselect();
      }
      set_position(default_position);
    } else if (moves.find(move => same_coords(move, destination))) {
      move(destination);
      deselect();
    } else {
      set_position(default_position);
      deselect();
    }
    set_double_select(false);
  }, [get_dropped_coords, movable, set_position, double_select, deselect, moves, move]);

  const mouse_down = useCallback((e) => {
    switch (e.button) {
    case 0: // left click
      e.stopPropagation();
      break;
    case 2: // right click
      set_position(default_position);
      break;
    }
  }, [set_position, default_position]);

  const drag = useCallback((e, ui) => {
    const { x, y } = ui;
    set_position({ x, y });
  }, [set_position]);

  return (
    <>
      <Draggable
        position={position}
        bounds={{ left: -tilesize / 2, top: -tilesize / 2, right: tilesize * 7.5, bottom: tilesize * 7.5 }}
        onStart={start}
        onStop={stop}
        onDrag={drag}
        onTouchStart={start}
        onTouchEnd={stop}
        onMouseDown={mouse_down}
        defaultClassNameDragging="dragged"
        allowAnyClick={false}
      >
        <div className="piece-wrapper">
          <img
            className="piece"
            style={style}
            draggable={false}
            src={pieces[color][type]}
            alt={`${type}${color}`}
          />
        </div>
      </Draggable>
      {movable && selected && moves.map(m =>
        <Hint
          tilesize={tilesize}
          pos={coords_to_pos(m)}
          move={() => move(m)}
          key={newId("hint")}
        />)}
    </>
  );
}
