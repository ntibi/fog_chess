import React from "react";
import { pieces } from "../../game/rules";
import pieces_icons from "../Pieces";
import "./CapturedPieces.css";

export default function CapturedPieces({ alive_pieces_number, eaten_pieces_numbers, color }) {

  return (<div className="eatenpieces">
    {pieces
      .filter(type => type !== "k")
      .map(type => new Array(eaten_pieces_numbers[type]).fill(type))
      .flat()
      .map((type, i) => 
        <img
          key={i}
          className="eatenpiece"
          draggable={false}
          src={pieces_icons[color][type]}
          alt={`${type}${color}`}
        />)}
    {[...Array(alive_pieces_number).keys()].map((i) => 
      <img
        key={i}
        className="filler"
        draggable={false}
        src={pieces_icons["w"]["p"]}
        alt={"filler"}
      />)}
  </div>);
}