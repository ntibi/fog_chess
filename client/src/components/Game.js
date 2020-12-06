import React, { useCallback, useEffect, useState } from 'react';
import "./Game.css"
import Over from "./Over"
import setup from "../game/setup"
import { moves } from "../game/moves"
import { first_color, apply_move, other_color } from "../game/rules"
import newId from "../utils/newId"
import { get_move } from "../game/engine"
import Interface from "./interface/Interface"
import Board from "./Board"
import { config } from "../game/engine"
import Online from "./interface/Online"
import { axios } from "../utils/axios"

const get_default_pieces = () => setup.map(piece => ({
  ...piece,
  moved: false,
  id: newId("piece"),
}))

const add_moves = (pieces) => pieces.map(piece => ({
  ...piece,
  moves: moves(piece, pieces),
}))

export default function Game() {
  const [level, set_level] = useState(config.level.default)
  const [over, set_over] = useState(false)
  const [coords_enabled, set_coords] = useState(false)
  const [fog_enabled, set_fog] = useState(true)
  const [turn, set_turn] = useState(first_color)
  const [pieces, set_pieces] = useState(add_moves(get_default_pieces()))
  const [history, set_history] = useState([{
    pieces,
    turn,
  }])
  const [controls, set_controls] = useState(first_color)
  const [online, set_online] = useState(false)
  const [socket, set_socket] = useState()
  const [move_to_send, send_move] = useState(false)

  useEffect(() => {
    if (move_to_send) {
      socket.once("move", ({ src, dst }) => move(src, dst))
      const { src, dst } = move_to_send
      if (src && dst)
        axios.post("/api/game/move", { src, dst })
      send_move(false)
    }
  }, [move_to_send])

  useEffect(() => {
    if (!online && !over && turn !== controls) {
      get_move(pieces, turn, level).then(({ src, dst }) => {
        if (src && dst)
          move(src, dst)
        else
          set_over(other_color(turn))
      })
    }
  }, [turn, controls])

  const restart = useCallback(() => {
    const pieces = add_moves(get_default_pieces())
    const turn = first_color
    set_over()
    set_pieces(pieces)
    set_history([{
      pieces,
      turn,
    }])
    set_turn(turn)
  }, [set_over, set_pieces, set_history, set_turn])

  const move = useCallback((src, dst) => {
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
    if (online && turn == controls) {
      send_move({ src, dst })
    }
  }, [pieces, history, turn, online, send_move, set_pieces, set_history, set_turn, controls])

  const start_online = useCallback((socket, color) => {
    restart()
    set_online(true)
    set_controls(color)
    set_socket(socket)
    if (color !== controls)
      send_move(true)
  }, [restart, set_online, set_controls, set_socket, controls, send_move])


  return (
    <div className="game">
      <Online
      start={start_online}
      started={online}
      />
      <Board
        pieces={pieces}
        fog_enabled={fog_enabled}
        turn={turn}
        controls={controls}
        over={over}
        coords_enabled={coords_enabled}
        move={move}
        history={history}
      />
      <Interface
        coords_enabled={coords_enabled}
        toggle_coords={() => set_coords(!coords_enabled)}
        fog_enabled={fog_enabled}
        toggle_fog={() => set_fog(!fog_enabled)}
        thinking={turn !== controls}
        engine_config={config}
        level={level}
        set_level={set_level}
        controls={controls}
        switch_controls={() => set_controls(other_color(controls))}
        online={online}
        pieces={pieces}
      />
      {over &&
        <Over
          winner={over}
          won={over === controls}
          restart={restart}
        />}

    </div>
  )
}
