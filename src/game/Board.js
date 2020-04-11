import React, { Component } from 'react';
import Tile from "./Tile"
import Piece from "./Piece"
import "./Board.css"
import setup from "./setup"
import { moves, same_coords } from "./moves"
import newId from "../utils/newId"
import update from "immutability-helper"

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tileSize: Math.floor((Math.min(window.innerWidth, window.innerHeight) / 10)),
            pieces: [],
            turn: "w",
        }
        this.move = this.move.bind(this)
        this.origin = React.createRef()
    }

    move(src, dst) {
        const pieceIndex = this.state.pieces.findIndex(p => same_coords(p.coords, src))
        this.setState({
            pieces: update(this.state.pieces, {
                [pieceIndex]: {
                    coords: {$set: dst},
                    moved: {$set: true},
                }
            }),
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

        this.setState({
            pieces,
        })
    }

    componentDidMount() {
        this.setupGame()
    }

    render() {
        const { tileSize } = this.state

        const tiles = []
        for (let i = 0; i < 8 * 8; i++) {
            const coords = { x: i % 8, y: Math.floor(i / 8 )}
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
                moves={moves(piece, this.state.pieces)}
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