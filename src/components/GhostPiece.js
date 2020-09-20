import React, { Component } from 'react';
import pieces from "./Pieces"

function GhostPiece(props) {
    const { coords, tileSize } = props;

    const style = {
        width: `${tileSize}px`,
        height: `${tileSize}px`,
        transform: `translate(${coords.x * tileSize}px, ${coords.y * tileSize}px)`,
        opacity: 0.2,
    }

    return (
        <img
            className="ghost_piece"
            style={style}
            draggable={false}
            src={pieces[props.color][props.type]}
            alt={`${props.type}${props.color}`}
        />
    )
}

export default GhostPiece