import React, { Component } from "react";
import "./Tile.css"
import Fog from "./Fog"

export default class Tile extends Component {

    render() {
        const { coords, tileSize } = this.props;
        const style = {
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            transform: `translate(${coords.x * tileSize}px, ${coords.y * tileSize}px)`
        }

        let visible_coords
        if (this.props.visible_coords)
            visible_coords = <p
                className="coordinate"
            >
                {`${this.props.coords.x} ${this.props.coords.y}`}
            </p>
        let fog
        if (!this.props.visible)
            fog = <Fog
                tileSize={tileSize}
                strength={this.props.fog_strength}
            />
        return (
            <div
                style={style}
                className={`tile ${this.props.color} ${this.props.highlighted ? "highlighted" : ""}`}
            >
                {fog}
                {visible_coords}
            </div>
        )
    }
}