import React from "react";
import "./Hint.css";

export default function Hint({ tilesize, pos, move }) {
  const hint_zone_style = {
    width: `${tilesize}px`,
    height: `${tilesize}px`,
    transform: `translate(${pos.x * tilesize}px, ${pos.y * tilesize}px)`
  };

  const size = tilesize / 3;
  const hint_style = {
    width: `${size}px`,
    height: `${size}px`,
    transform: `translate(${pos.x * tilesize + tilesize / 2 - size / 2}px, ${pos.y * tilesize + tilesize / 2 - size / 2}px)`
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