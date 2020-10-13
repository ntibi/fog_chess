import React, { useEffect, useState } from 'react';
import Tile from "./Tile"
import Piece from "./Piece"
import Over from "./Over"
import "./Board.css"
import setup from "../game/setup"
import { moves, same_coords } from "../game/moves"
import { first_color, apply_move, maxx, maxy, other_color } from "../game/rules"
import newId from "../utils/newId"
import { get_move } from "../game/engine"
import { compute_visible, fog_strength, is_visible } from "../game/fog"
import Interface from "./interface/Interface"
import GhostPiece from './GhostPiece';
import Board from "./Board"

const get_default_pieces = () => setup.map(piece => ({
    ...piece,
    moved: false,
    id: newId("piece"),
}))

export default function Game(props) {
    const [ level, set_level ] = useState(3)
    const [ over, set_over ] = useState(false)
    const [ coords, set_coords ] = useState(false)
    const [ fog, set_fog ] = useState(true)
    const [ turn, set_turn ] = useState()
    const [ pieces, set_pieces ] = useState(get_default_pieces)

    const move = (src, dst) => {
        let {
            pieces: new_pieces,
            turn,
            ate,
            winner,
        } = apply_move(src, dst, pieces)
        set_turn(other_color(turn))
        set_pieces(new_pieces)
    }

    return (
        <div>
            <Board
                pieces={pieces.map(piece => ({
                    ...piece,
                    moves: moves(piece, pieces),
                }))}
                fog={fog}
                turn={turn}
                controls={props.controls}
                over={over}
                coords={coords}
                move={move}
            />
            <Interface
                coords={coords}
                toggle_coords={() => set_coords(!coords)}
                fog={fog}
                toggle_fog={() => set_fog(!fog)}
                thinking={turn !== props.controls}
                level={level}
                set_level={set_level}
            />
        </div>
    )
}
