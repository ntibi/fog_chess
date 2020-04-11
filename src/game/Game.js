import React, { Component } from 'react';
import Board from "./Board"

export default class Game extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<Board/>)
    }
}