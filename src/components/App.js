import React, { Component } from 'react';
import Board from "./Board";
import FPS from "react-fps-stats"
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Container>
                <Jumbotron>
                    <FPS />
                    <Board
                        controls={"w"}
                    />
                </Jumbotron>
            </Container>
        )
    }
}