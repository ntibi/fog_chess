import React, { Component } from 'react';
import Board from "./game/Board";
import FPS from "react-fps-stats"

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            <FPS/>
            <Board
            controllers={{
                b: "computer",
                w: "human",
            }}
            />
            </>
        )
    }
}