import React, {Component} from 'react';
import "./Hint.css"

export default class Tile extends Component {
    render() {
        const { tileSize, coords } = this.props;
        const size = tileSize / 2.2;
        const style = {
            width: `${size}px`,
            height: `${size}px`,
            transform: `translate(${coords.x * tileSize + tileSize / 2 - size / 2}px, ${coords.y * tileSize + tileSize / 2 - size / 2}px)`
        };
        return (
            <span
                className="hint"
                style={style}
            ></span>
        )
    }
}