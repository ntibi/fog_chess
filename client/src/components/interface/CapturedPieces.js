import React from "react";
import { pieces } from "../../game/rules";
import pieces_icons from "../Pieces";
import "./CapturedPieces.css";

export default function CapturedPieces({ pieces_number, color }) {

  return (<div className="eatenpieces">
    {pieces
      .filter(type => type !== "k")
      .map(type => new Array(pieces_number[type]).fill(type))
      .flat()
      .map((type, i) => 
        <img
          key={i}
          className="eatenpiece"
          draggable={false}
          src={pieces_icons[color][type]}
          alt={`${type}${color}`}
        />)}
  </div>);
}