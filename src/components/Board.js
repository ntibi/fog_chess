import React, { Component } from 'react';
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

export default class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tileSize: 0,
            pieces: [],
            turn: first_color,
            selected: {},
            over: false,
            coords: false,
            fog: true,
            visible_tiles: [],
            ghosts: [],
        }
        this.move = this.move.bind(this)
        this.select = this.select.bind(this)
        this.mouse_down = this.mouse_down.bind(this)
        this.restart = this.restart.bind(this)
        this.origin = React.createRef()

        this.history = []
        this.ghost_pieces = []
    }

    restart() {
        this.reset_game()
    }

    game_over({ winner }) {
        this.setState({
            over: {
                winner,
            }
        })
    }

    get_history(n) {
        return this.history.slice(this.history.length - n)
    }

    add_moves(pieces) {
        return pieces.map(piece => ({
            ...piece,
            moves: moves(piece, pieces)
        }))
    }

    get_visibilty(pieces) {
        const allies = pieces.filter(piece => piece.color === this.props.controls)

        const visible_tiles = compute_visible(allies)
        return visible_tiles
    }

    move(src, dst) {
        let {
            pieces,
            turn,
            ate,
            winner,
        } = apply_move(src, dst, this.state.pieces)
        pieces = this.add_moves(pieces)
        const visible_tiles = this.get_visibilty(pieces)

        if (turn === this.props.controls) {
            if (ate)
                visible_tiles.push(dst)
            this.compute_ghosts(turn, { pieces, visible_tiles })
        }

        this.history.push({
            move: {
                src,
                dst,
            },
            ate,
            pieces: pieces,
            visible_tiles: visible_tiles,
        })
        this.setState({
            pieces,
            turn,
            selected: {},
            visible_tiles,
        }, async () => {
            if (winner)
                return this.game_over({ winner })
            if (this.state.turn !== this.props.controls) {
                const { src, dst } = await get_move(pieces, turn)
                if (!src)
                    return this.game_over({ winner: other_color(turn) })
                this.move(src, dst)
            }
        })
    }

    compute_ghosts(turn, now) {
        this.ghost_pieces = []

        const [prev] = this.get_history(1)

        if (prev) {
            prev.visible_tiles.forEach(tile => {
                const piece = prev.pieces.find(p => same_coords(p.coords, tile))
                if (piece && piece.color !== turn && !is_visible(now.visible_tiles, now.pieces.find(x => x.id === piece.id).coords)) {
                    this.ghost_pieces.push(piece)
                }
            })
        }
    }

    get_default_pieces() {
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

    reset_game() {
        let pieces = this.get_default_pieces()
        pieces = this.add_moves(pieces)
        const visible_tiles = this.get_visibilty(pieces)
        this.setState({
            pieces,
            over: false,
            turn: first_color,
            selected: {},
            over: false,
            coords: false,
            visible_tiles,
        })
        this.history = []
        this.ghost_pieces = []
    }

    resize() {
        this.setState({
            tileSize: Math.floor((Math.min(window.innerWidth, window.innerHeight) / 10)),
        })
    }

    componentDidMount() {
        this.resize()
        window.addEventListener("resize", this.resize.bind(this));
        this.reset_game()
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize.bind(this));
    }

    cancel(e) {
        e.preventDefault()
        return false
    }

    mouse_down(e) {
        switch (e.button) {
            case 0:
                this.setState({
                    selected: {}
                })
                break;
        }
    }

    select(coords) {
        if (same_coords(coords, this.state.selected))
            this.setState({
                selected: {},
            })
        else
            this.setState({
                selected: coords,
            })
    }

    render() {
        const { tileSize, pieces } = this.state

        const tiles = [];

        [...Array(maxy + 1).keys()].forEach(y => {
            [...Array(maxx + 1).keys()].forEach(x => {
                const coords = { x, y }
                const visible = this.state.visible_tiles.find(t => same_coords(t, { x, y }))
                let highlighted = visible ? this.get_history(1).some(({ move }) => same_coords(move.dst, { x, y })) : false
                if (same_coords(this.state.selected, { x, y }))
                    highlighted = true
                tiles.push(
                    <Tile
                        key={`${x} ${y}`}
                        coords={coords}
                        tileSize={tileSize}
                        color={!((x + y) % 2) ? "light" : "dark"}
                        visible={!this.state.fog || visible}
                        fog_strength={fog_strength(coords, this.state.visible_tiles)}
                        highlighted={highlighted}
                        visible_coords={this.state.coords}
                    />
                )
            })
        })



        const pieces_to_render = (!this.state.fog ? pieces : pieces.filter(piece => this.state.visible_tiles.find(c => same_coords(piece.coords, c)))).map(piece =>
            <Piece
                key={piece.id}
                type={piece.type}
                color={piece.color}
                tileSize={tileSize}
                coords={piece.coords}
                moves={piece.moves}
                turn={this.state.turn === piece.color}
                move={this.move}
                select={this.select}
                selected={same_coords(this.state.selected, piece.coords)}
                ally={piece.color === this.props.controls}
                can_move={!this.state.over}
                origin={this.origin}
            />
        )

        return (
            <div>
                <div
                    className="board"
                    style={{
                        width: `${tileSize * 8}px`,
                        height: `${tileSize * 8}px`,
                    }}
                    onMouseDown={this.mouse_down}
                    onContextMenu={this.cancel}
                    ref={this.origin}
                >
                    {this.state.over &&
                        <Over
                            winner={this.state.over.winner}
                            won={this.state.over.winner === this.props.controls}
                            restart={this.restart}
                        />}

                    {tiles}
                    {pieces_to_render}
                    {this.ghost_pieces.map(x => <GhostPiece
                        type={x.type}
                        color={x.color}
                        tileSize={tileSize}
                        coords={x.coords}
                        key={x.id}
                    />)}
                </div>
                <Interface
                    coords={this.state.coords}
                    toggle_coords={() => this.setState({ coords: !this.state.coords })}
                    fog={this.state.fog}
                    toggle_fog={() => this.setState({ fog: !this.state.fog })}
                    thinking={this.state.turn !== this.props.controls}
                />
            </div>
        )
    }
}