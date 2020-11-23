import React from "react";
import pieces from "./Pieces";

function GhostPiece({ pos, tilesize, color, type }) {
  const style = {
    width: `${tilesize}px`,
    height: `${tilesize}px`,
    left: `${pos.x * tilesize}px`,
    top: `${pos.y * tilesize}px`,
    position: "absolute",
    opacity: 0.2,
  };

  return (
    <img
      className="ghost_piece"
      style={style}
      draggable={false}
      src={pieces[color][type]}
      alt={`${type}${color}`}
    />
  );
}

export default GhostPiece;