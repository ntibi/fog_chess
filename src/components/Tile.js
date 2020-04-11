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
        return (
            <div
                style={style}
                className={`tile ${this.props.color}`}
            >
                {!this.props.visible &&
                    <Fog
                        tileSize={tileSize}
                        strength={this.props.fog_strength}
                    />}
            </div>
        )
    }
}