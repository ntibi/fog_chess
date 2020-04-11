import React, { Component } from 'react';
import Tile from "./Tile"
import Piece from "./Piece"
import "./Board.css"
import setup from "../game/setup"
import { moves, same_coords } from "../game/moves"
import { first_color, apply_move } from "../game/rules"
import { get_move } from "../game/engine"
import newId from "../utils/newId"
import Hint from "./Hint"

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tileSize: Math.floor((Math.min(window.innerWidth, window.innerHeight) / 10)),
            pieces: [],
            turn: first_color,
        }
        this.move = this.move.bind(this)
        this.origin = React.createRef()
    }

    add_moves(pieces) {
        return pieces.map(piece => ({
            ...piece,
            moves: moves(piece, pieces)
        }))
    }

    move(src, dst) {
        let {
            pieces,
            turn,
        } = apply_move(src, dst, this.state.pieces)
        pieces = this.add_moves(pieces)
        this.setState({
            pieces,
            turn,
        }, () => {
            if (this.props.controllers[this.state.turn] === "computer") {
                const { src, dst } = get_move(pieces, turn)
                this.move(src, dst)
            }
        })
    }

    setupGame() {
        const pieces = []

        setup.forEach(piece => {
            pieces.push({
                ...piece,
                moved: false,
                id: newId("piece"),
            })
        })
        return pieces
    }

    componentDidMount() {
        let pieces = this.setupGame()
        pieces = this.add_moves(pieces)
        this.setState({
            pieces
        })
    }

    render() {
        const { tileSize } = this.state

        const tiles = []
        for (let i = 0; i < 8 * 8; i++) {
            const coords = { x: i % 8, y: Math.floor(i / 8) }
            tiles.push(
                <Tile
                    key={i}
                    coords={coords}
                    tileSize={tileSize}
                    color={!((i % 8 + Math.floor(i / 8)) % 2) ? "light" : "dark"}
                />
            )
        }

        const pieces = this.state.pieces.map(piece =>
            <Piece
                key={piece.id}
                type={piece.type}
                color={piece.color}
                tileSize={tileSize}
                coords={piece.coords}
                moves={piece.moves}
                turn={this.state.turn === piece.color}
                move={this.move}
                origin={this.origin}
            />
        )

        return (
            <div
                className="board"
                style={{
                    width: `${tileSize * 8}px`,
                    height: `${tileSize * 8}px`,
                }}
                ref={this.origin}
            >
                {tiles}
                {pieces}
            </div>
        )
    }
}