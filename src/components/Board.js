import React, { Component } from 'react';
import Tile from "./Tile"
import Piece from "./Piece"
import Over from "./Over"
import "./Board.css"
import setup from "../game/setup"
import { moves, same_coords } from "../game/moves"
import { first_color, apply_move, maxx, maxy } from "../game/rules"
import newId from "../utils/newId"
import { get_move } from "../game/engine"
import { compute_visible, fog_strength, is_visible } from "../game/fog"
import Interface from "./interface/Interface"
import { Container, Row, Col } from 'react-bootstrap';
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
            last_seen: null,
        }
        this.move = this.move.bind(this)
        this.select = this.select.bind(this)
        this.mouse_down = this.mouse_down.bind(this)
        this.restart = this.restart.bind(this)
        this.origin = React.createRef()

        this.history = []
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
            winner,
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
            selected: {},
            last_seen: null,
        }, async () => {
            if (winner)
                return this.game_over({ winner })
            if (this.state.turn !== this.props.controls) {
                const { src, dst } = await get_move(pieces, turn)
                this.set_last_seen(src, dst)
                this.move(src, dst)
            }
        })
    }

    set_last_seen(src, dst) {
        this.setState({
            last_seen: {
                src,
                dst,
                piece: this.state.pieces.find(p => same_coords(p.coords, src)),
            }
        })
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
        this.setState({
            pieces,
            over: false,
            turn: first_color,
            selected: {},
            over: false,
            coords: false,
            last_seen: null,
        })
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

        const allies = pieces.filter(piece => piece.color === this.props.controls)

        const visible_tiles = compute_visible(allies)
        this.last_moves(1).forEach(last => {
            if (last.ate && !is_visible(visible_tiles, last.move.dst))
                visible_tiles.push(last.move.dst)
        })

        const tiles = [];

        [...Array(maxy + 1).keys()].forEach(y => {
            [...Array(maxx + 1).keys()].forEach(x => {
                const coords = { x, y }
                const visible = visible_tiles.find(t => same_coords(t, { x, y }))
                let highlighted = visible ? this.last_moves(1).some(m => same_coords(m.move.dst, { x, y })) : false
                if (same_coords(this.state.selected, { x, y }))
                    highlighted = true
                tiles.push(
                    <Tile
                        key={`${x} ${y}`}
                        coords={coords}
                        tileSize={tileSize}
                        color={!((x + y) % 2) ? "light" : "dark"}
                        visible={!this.state.fog || visible}
                        fog_strength={fog_strength(coords, visible_tiles)}
                        highlighted={highlighted}
                        visible_coords={this.state.coords}
                    />
                )
            })
        })



        const pieces_to_render = (!this.state.fog ? pieces : pieces.filter(piece => visible_tiles.find(c => same_coords(piece.coords, c)))).map(piece =>
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

        let ghost_piece = null
        if (this.state.last_seen
            && visible_tiles.some(t => same_coords(t, this.state.last_seen.src))
            && !visible_tiles.some(t => same_coords(t, this.state.last_seen.dst)))
        ghost_piece = <GhostPiece
                type={this.state.last_seen.piece.type}
                color={this.state.last_seen.piece.color}
                tileSize={tileSize}
                coords={this.state.last_seen.src}
         />

        return (
            <Container fluid style={{ width: tileSize * 8 }}>
                <Row>
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
                        {ghost_piece}
                    </div>
                </Row>
                <Row>
                    <Interface
                        coords={this.state.coords}
                        toggle_coords={() => this.setState({ coords: !this.state.coords })}
                        fog={this.state.fog}
                        toggle_fog={() => this.setState({ fog: !this.state.fog })}
                        thinking={this.state.turn !== this.props.controls}
                    />
                </Row>
            </Container>
        )
    }
}