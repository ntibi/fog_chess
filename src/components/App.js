import React, { Component } from 'react';
import Board from "./Board";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Board
                    controls={"w"}
                />
                <div className="source">
                    <a href="https://github.com/ntibi/fog_chess">source</a>
                </div>
            </div>
        )
    }
}