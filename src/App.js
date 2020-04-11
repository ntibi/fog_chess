import React, { Component } from 'react';
import Game from "./game/Game";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Game />
        )
    }
}