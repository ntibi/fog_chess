import React, { useEffect, useState } from 'react';
import Over from "./Over"
import "./Board.css"
import setup from "../game/setup"
import { moves } from "../game/moves"
import { first_color, apply_move, other_color } from "../game/rules"
import newId from "../utils/newId"
import { get_move } from "../game/engine"
import Interface from "./interface/Interface"
import Board from "./Board"
import { config } from "../game/engine"

const get_default_pieces = () => setup.map(piece => ({
  ...piece,
  moved: false,
  id: newId("piece"),
}))

const add_moves = (pieces) => pieces.map(piece => ({
  ...piece,
  moves: moves(piece, pieces),
}))

export default function Game(props) {
  const [level, set_level] = useState(config.level.default)
  const [over, set_over] = useState(false)
  const [coords, set_coords] = useState(false)
  const [fog, set_fog] = useState(true)
  const [turn, set_turn] = useState(first_color)
  const [pieces, set_pieces] = useState(add_moves(get_default_pieces()))
  const [history, set_history] = useState([{
    pieces,
    turn,
  }])

  useEffect(() => {
    if (!over && turn !== props.controls) {
      get_move(pieces, turn, level).then(({ src, dst }) => {
        if (src && dst)
          move(src, dst)
        else
          set_over(other_color(turn))
      })
    }
  }, [turn])

  const restart = () => {
    const pieces = add_moves(get_default_pieces())
    const turn = first_color
    set_over()
    set_pieces(pieces)
    set_history([{
      pieces,
      turn,
    }])
    set_turn(turn)
  }

  const move = (src, dst) => {
    let {
      pieces: new_pieces,
      turn: new_turn,
      ate,
      winner,
    } = apply_move(src, dst, pieces)
    new_pieces = add_moves(new_pieces)

    if (winner)
      set_over(winner)

    set_pieces(new_pieces)
    set_history([...history, {
      move: {src, dst},
      ate,
      pieces: new_pieces,
      turn: new_turn,
    }])
    set_turn(new_turn)
  }

  return (
    <div>
      <Board
        pieces={pieces}
        fog={fog}
        turn={turn}
        controls={props.controls}
        over={over}
        coords={coords}
        move={move}
        history={history}
      />
      <Interface
        coords={coords}
        toggle_coords={() => set_coords(!coords)}
        fog={fog}
        toggle_fog={() => set_fog(!fog)}
        thinking={turn !== props.controls}
        engine_config={config}
        level={level}
        set_level={set_level}
      />
      {over &&
        <Over
          winner={over}
          won={over === props.controls}
          restart={restart}
        />}

    </div>
  )
}
