import React, { Component } from 'react';
import "./Over.css"

export default class Over extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div
                className="over"
            >
                <div>
                    <p>you {this.props.won ? "won" : "lost"}</p>
                    <button onClick={this.props.restart}>restart</button>
                </div>
            </div>
        )
    }
}