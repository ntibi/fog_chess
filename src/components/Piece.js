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
            dragging_enabled: true,
        }
        this.drop = this.drop.bind(this)
        this.hint = this.hint.bind(this)
        this.stopHint = this.stopHint.bind(this)
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

    cancel(e) {
        e.preventDefault()
        this.stopDragging()
    }

    stopDragging() {
        this.setState({
            dragging_enabled: false,
        }, () => this.setState({
            dragging_enabled: true,
        }))
    }

    drop() {
        this.stopHint()
        if (!this.props.turn)
            return
        const mouse = this.getMouse(event);
        const destination = {
            x: clamp(parseInt(mouse.x / this.props.tileSize), 0, 7),
            y: clamp(parseInt(mouse.y / this.props.tileSize), 0, 7),
        }

        if (this.props.moves.find(move => same_coords(move, destination)))
            this.props.move(this.props.coords, destination)
    }

    hint() {
        if (!this.props.turn)
            return
        this.setState({
            hint: true,
        })
    }

    stopHint() {
        this.setState({
            hint: false,
        })
    }

    render() {
        const { coords, tileSize } = this.props;
        const style = {
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            transform: `translate(${coords.x * tileSize}px, ${coords.y * tileSize}px)`
        }

        let hints = []
        if (this.state.hint)
            hints = this.props.moves.map(move =>
                <Hint
                    tileSize={tileSize}
                    coords={move}
                    key={newId("hint")}
                />)

        return (
            <>
            <Draggable
                position={{
                    x: coords.x * tileSize,
                    y: coords.y * tileSize,
                }}
                bounds={{ left: -tileSize / 2, top: -tileSize / 2, right: tileSize * 7.5, bottom: tileSize * 7.5 }}
                onStop={this.drop}
                onStart={this.hint}
                onClick={this.hint}
                defaultClassNameDragging="dragged"
                allowAnyClick={false}
                disabled={!this.state.dragging_enabled}
            >
                <img
                    className="piece"
                    onMouseEnter={this.hint}
                    onMouseLeave={this.stopHint}
                    onContextMenu={this.cancel}
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