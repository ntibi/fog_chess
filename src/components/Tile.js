import React from "react";
import "./Tile.css";
import Fog from "./Fog";

export default function Tile({ coords, tilesize, visible, visible_coords, color, highlighted, fog_strength }) {
  const style = {
    width: `${tilesize}px`,
    height: `${tilesize}px`,
    transform: `translate(${coords.x * tilesize}px, ${coords.y * tilesize}px)`
  };

  return (
    <div
      style={style}
      className={`tile ${color} ${highlighted ? "highlighted" : ""}`}
    >
      {!visible && <Fog tilesize={tilesize} strength={fog_strength} />}
      {visible_coords && <p className="coordinates">{`${coords.x} ${coords.y}`}</p>}
    </div>
  );
}