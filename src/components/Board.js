import React, { Component } from 'react';
import Tile from "./Tile"
import Piece from "./Piece"
import "./Board.css"
import setup from "../game/setup"
import { moves, same_coords } from "../game/moves"
import { first_color, apply_move, maxx, maxy } from "../game/rules"
import newId from "../utils/newId"
import { get_move } from "../game/engine"
import { compute_visible, fog_strength, is_visible } from "../game/fog"

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

        this.history = []
    }

    last_moves(n) {
        return this.history.slice(this.history.length - n)
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
            ate,
        } = apply_move(src, dst, this.state.pieces)
        this.history.push({
            move: {
                src,
                dst,
            },
            ate,
        })
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

    cancel(e) {
        e.preventDefault()
        return false
    }

    render() {
        const { tileSize, pieces } = this.state
    
        const allies = pieces.filter(piece => piece.color === this.props.controls)

        const visible_tiles = compute_visible(allies)
        this.last_moves(1).forEach(last => {
            if (last.ate && !is_visible(visible_tiles, last.move.dst))
                visible_tiles.push(last.move.dst)
        })

        const tiles = [];

        [...Array(maxy + 1).keys()].forEach(y => {
            [...Array(maxx + 1).keys()].forEach(x => {
                const coords = {x, y}
                const visible = visible_tiles.find(t => same_coords(t, { x, y }))
                tiles.push(
                    <Tile
                        key={`${x} ${y}`}
                        coords={coords}
                        tileSize={tileSize}
                        color={!((x + y) % 2) ? "light" : "dark"}
                        visible={visible}
                        fog_strength={fog_strength(coords, visible_tiles)}
                        highlighted={visible ? this.last_moves(1).some(m => same_coords(m.move.dst, { x, y })) : false}
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
                onContextMenu={this.cancel}
                ref={this.origin}
            >
                {tiles}
                {pieces_to_render}
            </div>
        )
    }
}