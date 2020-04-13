import React, { Component } from 'react';
import "./Hint.css"

export default class Tile extends Component {

    constructor(props) {
        super(props);
        this.mouse_down = this.mouse_down.bind(this)
    }

    mouse_down(e) {
        switch (e.button) {
            case 0:
                this.props.click_move()
                break;
        }
    }

    render() {
        const { tileSize, coords } = this.props;

        const hint_zone_style = {
            width: `${tileSize}px`,
            height: `${tileSize}px`,
            transform: `translate(${coords.x * tileSize}px, ${coords.y * tileSize}px)`,
        };

        const size = tileSize / 2.6;
        const hint_style = {
            width: `${size}px`,
            height: `${size}px`,
            transform: `translate(${coords.x * tileSize + tileSize / 2 - size / 2}px, ${coords.y * tileSize + tileSize / 2 - size / 2}px)`,
        };
        return (
            <>
                <div
                    style={hint_zone_style}
                    className="hint_zone"
                    onMouseDown={this.mouse_down}
                >
                </div>
                <span
                    className="hint"
                    style={hint_style}
                />
            </>
        )
    }
}