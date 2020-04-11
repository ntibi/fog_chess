import React, { Component } from 'react';
import Tile from "./Tile"
import Piece from "./Piece"
import "./Board.css"
import setup from "../game/setup"
import { moves, same_coords } from "../game/moves"
import { first_color, apply_move, maxx, maxy } from "../game/rules"
import newId from "../utils/newId"
import { get_move } from "../game/engine"
import { compute_visible, fog_distance } from "../game/fog"

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
        }, async () => {
            if (this.state.turn !== this.props.controls) {
                const { src, dst } = await get_move(pieces, turn)
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
        const { tileSize, pieces } = this.state
    
        const allies = pieces.filter(piece => piece.color === this.props.controls)

        const visible_tiles = compute_visible(allies) // TODO do not call the function in render

        const tiles = [];

        [...Array(maxy + 1).keys()].forEach(y => {
            [...Array(maxx + 1).keys()].forEach(x => {
                const coords = {x, y}
                const visible = visible_tiles.find(t => t.x === x && t.y === y)
                tiles.push(
                    <Tile
                        key={`${x} ${y}`}
                        coords={coords}
                        tileSize={tileSize}
                        color={!((x + y) % 2) ? "light" : "dark"}
                        visible={visible}
                        fog_strength={!visible && fog_distance(coords, allies)}
                    />
                )
            })
        })



        const pieces_to_render = pieces.filter(piece => visible_tiles.find(c => same_coords(piece.coords, c))).map(piece =>
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
                {pieces_to_render}
            </div>
        )
    }
}