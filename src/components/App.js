import React, { Component } from 'react';
import Board from "./Board";
import FPS from "react-fps-stats"
import 'bootstrap/dist/css/bootstrap.min.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import "./App.css"

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Container>
                    <Jumbotron>
                        <FPS />
                        <Board
                            controls={"w"}
                        />
                    </Jumbotron>
                </Container>
                <div className="source">
                    <a href="https://github.com/ntibi/fog_chess">source</a>
                </div>
            </div>
        )
    }
}