import React, { useMemo } from "react";
import setup from "../../game/setup";
import { colors, score, color_name, other_color } from "../../game/rules";
import "./CapturedCounts.css";
import CapturedPieces from "./CapturedPieces";

export default function CapturedCounts({ pieces, controls }) {

  const players = useMemo(() => {
    const players = {};

    for (let color of colors) {
      const default_pieces = setup.filter(piece => color === piece.color && piece.type !== "k");
      const default_pieces_counts = {};
      default_pieces.forEach(({ type }) => default_pieces_counts[type] = (default_pieces_counts[type] || 0) + 1);
      const alive_pieces = pieces.filter(piece => color === piece.color && piece.type !== "k");
      const alive_pieces_counts = {};
      alive_pieces.forEach(({ type }) => alive_pieces_counts[type] = (alive_pieces_counts[type] || 0) + 1);
      const value = Object.keys(alive_pieces_counts).reduce((acc, type) => acc + (alive_pieces_counts[type] || 0) * score[type], 0);
      players[color] = {
        default_pieces_counts,
        alive_pieces_counts,
        value,
      };
    }

    for (let color of colors) {
      const other = other_color(color);
      const eaten_pieces_counts = {};
      Object.keys(players[other].default_pieces_counts).forEach(key =>
        eaten_pieces_counts[key] = players[other].default_pieces_counts[key] - (players[other].alive_pieces_counts[key] || 0));
      players[color].eaten_pieces_counts = eaten_pieces_counts;
    }

    return players;
  }, [ pieces, controls ]);

  return (
    <div>
      {
        colors.map(color => {
          const score = players[color].value - players[other_color(color)].value;
          let score_text;
          if (score > 0)
            score_text = `+${score}`;
          else if (score < 0)
            score_text = score;
          return (<div key={color}>
            <p className={`score ${color === controls ? "yourscore" : ""}`}>
              {color_name[color]} {score_text}
            </p>
            <CapturedPieces
              color={other_color(color)}
              eaten_pieces_numbers={players[color].eaten_pieces_counts}
              alive_pieces_number={Object.values(players[other_color(color)].alive_pieces_counts).reduce((acc, v) => acc + v, 0)}
            />
          </div>);
        })
      }
    </div>
  );
}