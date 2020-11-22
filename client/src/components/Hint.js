import React from "react";
import "./Hint.css";

export default function Tile({ tilesize, pos, move }) {
  const hint_zone_style = {
    width: `${tilesize}px`,
    height: `${tilesize}px`,
    left: `${pos.x * tilesize}px`,
    top: `${pos.y * tilesize}px`,
  };

  const size = tilesize / 3;
  const hint_style = {
    width: `${size}px`,
    height: `${size}px`,
    left: `${pos.x * tilesize + tilesize / 2 - size / 2}px`,
    top: `${pos.y * tilesize + tilesize / 2 - size / 2}px`,
  };

  return (
    <>
      <div
        style={hint_zone_style}
        className="hint_zone"
        onMouseDown={(e) => e.button === 0 && move()}
      >
      </div>
      <span
        className="hint"
        style={hint_style}
      />
    </>
  );
}