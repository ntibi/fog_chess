import React, { Component } from "react";
import "./Tile.css"
import { maxx, maxy } from "../game/rules"

const max_dist = Math.max(maxx, maxy) + 1
const min_gray = 40
const max_gray = 90

export default class Tile extends Component {
    render() {
        const { coords, tileSize } = this.props;
        const style = {
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            transform: `translate(${coords.x * tileSize}px, ${coords.y * tileSize}px)`
        }
        if (!this.props.visible && this.props.fog_strength) {
            const strength = Math.floor((max_gray - min_gray) - (this.props.fog_strength * (max_gray - min_gray)/max_dist) + min_gray)
            style.backgroundColor = `rgb(${strength},${strength},${strength})`
        }
        return (
            <div
                style={style}
                className={`tile ${this.props.color} ${this.props.visible ? "" : "fogged"}`}
            >
                {/* {this.props.fog_strength && this.props.fog_strength.toFixed(2)} */}
                </div>
        )
    }
}