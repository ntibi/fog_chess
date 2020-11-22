import React from "react";
import pieces from "./Pieces";

function GhostPiece(props) {
  const { pos, tileSize } = props;

  const style = {
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    left: `${pos.x * tileSize}px`,
    top: `${pos.y * tileSize}px`,
    position: "absolute",
    opacity: 0.2,
  };

  return (
    <img
      className="ghost_piece"
      style={style}
      draggable={false}
      src={pieces[props.color][props.type]}
      alt={`${props.type}${props.color}`}
    />
  );
}

export default GhostPiece;