import React, { useState } from "react";
import pieces from "./Pieces";
import "./Piece.css";
import Draggable from "react-draggable";
import clamp from "../utils/clamp";
import { same_coords } from "../game/moves";
import Hint from "./Hint";
import newId from "../utils/newId";
import { minx, maxx, miny, maxy } from "../game/rules";

export default function Piece({ coords, tilesize, color, type, moves, selected, select, deselect, origin, move, movable }) {
  const [ double_select, set_double_select ] = useState(false);

  const position = { x: coords.x * tilesize, y: coords.y * tilesize };

  const style = {
    width: `${tilesize}px`,
    height: `${tilesize}px`,
    transform: `translate(${coords.x * tilesize}px, ${coords.y * tilesize}px)`
  };

  const get_mouse = (event) => {
    const mouse = {
      x: event.clientX,
      y: event.clientY,
    };

    const rect = origin.current.getBoundingClientRect();

    const relative_origin = {
      x: rect.x + window.scrollX,
      y: rect.y + window.scrollY,
    };

    return {
      x: mouse.x - relative_origin.x,
      y: mouse.y - relative_origin.y,
    };
  };

  const start = () => {
    if (!movable)
      return;

    if (selected) {
      set_double_select(true);
    }
    select();
  };
    
  const stop = (e) => {
    const mouse = get_mouse(e);

    if (!movable)
      return;

    const destination = {
      x: clamp(parseInt(mouse.x / tilesize), minx, maxx),
      y: clamp(parseInt(mouse.y / tilesize), miny, maxy),
    };
    if (same_coords(destination, coords)) {
      if (double_select) {
        deselect();
      }
    } else if (moves.find(move => same_coords(move, destination))) {
      move(destination);
      deselect();
    } else {
      deselect();
    }
    set_double_select(false);
  };

  const mouse_down = (e) => {
    switch (e.button) {
    case 0: // left click
      e.stopPropagation();
      break;
    }
  };

  return (
    <>
      <Draggable
        position={position}
        bounds={{ left: -tilesize / 2, top: -tilesize / 2, right: tilesize * 7.5, bottom: tilesize * 7.5 }}
        onStart={start}
        onStop={stop}
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