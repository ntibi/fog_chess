import React, { Component } from "react";
import { maxx, maxy } from "../game/rules"
import "./Fog.css"

const min = 50
const max = 80

export default class Fog extends Component {
    render() {
        const { tileSize } = this.props;
        const strength = (1 - this.props.strength) * (max - min) + min
        const style = {
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            backgroundColor: `rgb(${strength},${strength},${strength})`,
        }
        return (
            <div
                style={style}
                className={`fog`}
            />
        )
    }
}