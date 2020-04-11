import React, { Component } from "react";
import "./Tile.css"

export default class Tile extends Component {
    render() {
        const { coords, tileSize } = this.props;
        const style = {
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            transform: `translate(${coords.x * tileSize}px, ${coords.y * tileSize}px)`
        }
        return (
            <div
                style={style}
                className={`tile ${this.props.color} ${this.props.highlighted ? "highlighted" : ""}`}
            />
        )
    }
}