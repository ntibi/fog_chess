import React from "react";
import { pieces } from "../../game/rules";
import pieces_icons from "../Pieces";
import "./CapturedPieces.css";

export default function CapturedPieces({ default_pieces_count, eaten_pieces_numbers, color }) {

  return (<div className="eatenpieces">
    <div
      className="filler"
      style={{
        width: `${default_pieces_count * 20}px`
      }}
    >
      {pieces
        .filter(type => type !== "k")
        .map(type => new Array(eaten_pieces_numbers[type]).fill(type))
        .flat()
        .map((type, i) => <img
          key={i}
          className="eatenpiece"
          draggable={false}
          src={pieces_icons[color][type]}
          alt={`${type}${color}`}
        />)}
    </div>
  </div>
  );
}