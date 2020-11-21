import React, { useEffect, useState } from "react";
import pieces from "./Pieces";
import "./Piece.css";
import Draggable from "react-draggable";
import clamp from "../utils/clamp";
import { same_coords } from "../game/moves";
import Hint from "./Hint";
import newId from "../utils/newId";
import { minx, maxx, miny, maxy } from "../game/rules";

export default function Piece({ coords, tilesize, color, type, moves, selected, select, deselect, move, movable }) {
  const [ double_select, set_double_select ] = useState(false);

  const default_position = { x: coords.x * tilesize, y: coords.y * tilesize };
  const [ position, set_position ] = useState(default_position);

  const style = {
    width: `${tilesize}px`,
    height: `${tilesize}px`,
    transform: `translate(${coords.x * tilesize}px, ${coords.y * tilesize}px)`
  };

  const get_dropped_coords = () => {
    const dropped = {
      x: position.x + tilesize / 2,
      y: position.y + tilesize / 2,
    };

    return {
      x: clamp(parseInt(dropped.x / tilesize), minx, maxx),
      y: clamp(parseInt(dropped.y / tilesize), miny, maxy),
    };
  };

  useEffect(() => {
    set_position(default_position);
  }, [coords, tilesize]);

  const start = () => {
    if (!movable)
      return;

    if (selected) {
      set_double_select(true);
    }
    select();
  };
    
  const stop = (e) => {
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
  };

  const mouse_down = (e) => {
    switch (e.button) {
    case 0: // left click
      e.stopPropagation();
      break;
    case 2: // right click
      set_position(default_position);
      break;
    }
  };

  const drag = (e, ui) => {
    const { x, y } = ui;
    const new_pos = { x, y };
    set_position(new_pos);
  };

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
        <img
          className="piece"
          style={style}
          draggable={false}
          src={pieces[color][type]}
          alt={`${type}${color}`}
        />
      </Draggable>
      {movable && selected && moves.map(m =>
        <Hint
          tilesize={tilesize}
          coords={m}
          move={() => move(m)}
          key={newId("hint")}
        />)}
    </>
  );
}
