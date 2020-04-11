import React, { Component } from 'react';
import Board from "./Board";
import FPS from "react-fps-stats"

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <FPS />
                <Board
                    controls={"w"}
                />
            </>
        )
    }
}