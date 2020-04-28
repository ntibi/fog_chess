import React, { Component } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import "./Interface.css"

export default class Interface extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Row className="interface" style={{ padding: "10px" }}>
                <Col>
                    <Button onClick={this.props.toggle_coords} active={this.props.coords} variant="secondary">coords</Button>
                </Col>
                <Col>
                    <Button onClick={this.props.toggle_fog} active={this.props.fog} variant="secondary">fog</Button>
                </Col>
            </Row>
        )
    }
}