import React, { Component } from 'react';
import pieces from "./Pieces"
import "./Piece.css"
import Draggable from "react-draggable"
import clamp from "../utils/clamp"
import { same_coords } from "../game/moves"
import Hint from "./Hint"
import newId from "../utils/newId"

export default class Piece extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hint: false,
            disable_drag: false,
            pos: null,
        }
        this.drop = this.drop.bind(this)
        this.hint = this.hint.bind(this)
        this.stop_hint = this.stop_hint.bind(this)
        this.mouse_down = this.mouse_down.bind(this)
        this.onDrag = this.onDrag.bind(this)
    }

    onDrag(mousemove) {
        const { x, y } = mousemove
        this.setState({
            pos: {
                x,
                y,
            }
        })
    }

    getMouse(event) {
        const mouse = {
            x: event.clientX,
            y: event.clientY,
        }

        const rect = this.props.origin.current.getBoundingClientRect()

        const origin = {
            x: rect.x + window.scrollX,
            y: rect.y + window.scrollY,
        }

        return {
            x: mouse.x - origin.x,
            y: mouse.y - origin.y,
        }
    }

    drop(event) {
        this.setState({
            pos: null,
        })
        if (!this.props.can_move)
            return
        this.stop_hint()
        if (this.state.disable_drag)
            return this.setState({
                disable_drag: false,
            })
        if (!this.props.turn)
            return
        const mouse = this.getMouse(event);
        const destination = {
            x: clamp(parseInt(mouse.x / this.props.tileSize), 0, 7),
            y: clamp(parseInt(mouse.y / this.props.tileSize), 0, 7),
        }

        if (this.props.moves.find(move => same_coords(move, destination))) {
            this.props.move(this.props.coords, destination)
        }
    }

    hint() {
        if (!this.props.turn)
            return
        this.setState({
            hint: true,
        })
    }

    stop_hint() {
        this.setState({
            hint: false,
        })
    }

    stop_dragging() {
        this.setState({
            disable_drag: true,
        })
    }

    mouse_down(e) {
        switch (e.button) {
            case 0: // left click
                if (this.props.ally) {
                    e.stopPropagation()
                    this.props.select(this.props.coords)
                }
                break;
            case 2: // right click
                this.stop_dragging()
                break;
        }
    }

    render() {
        const { coords, tileSize } = this.props;
        const style = {
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            transform: `translate(${coords.x * tileSize}px, ${coords.y * tileSize}px)`
        }

        let hints = []
        if (this.props.can_move && this.props.turn && (this.state.hint || this.props.selected))
            hints = this.props.moves.map(move =>
                <Hint
                    tileSize={tileSize}
                    coords={move}
                    click_move={() => this.props.move(this.props.coords, move)}
                    key={newId("hint")}
                />)

        const position = this.state.pos && !this.state.disable_drag ? this.state.pos : { x: coords.x * tileSize, y: coords.y * tileSize, }
        return (
            <>
                <Draggable
                    position={position}
                    bounds={{ left: -tileSize / 2, top: -tileSize / 2, right: tileSize * 7.5, bottom: tileSize * 7.5 }}
                    onDrag={this.onDrag}
                    onStop={this.drop}
                    onStart={this.hint}
                    defaultClassNameDragging="dragged"
                    allowAnyClick={false}
                    onMouseDown={this.mouse_down}
                >
                    <img
                        className="piece"
                        style={style}
                        draggable={false}
                        src={pieces[this.props.color][this.props.type]}
                        alt={`${this.props.type}${this.props.color}`}
                    />
                </Draggable>
                {hints}
            </>
        )
    }
}