import React, { Component } from 'react';
import { Row, Col, Button, Spinner } from 'react-bootstrap';
import "./Interface.css"

export default class Interface extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
            return (
                <>
                    <Row className="m-1">
                        <Col className="border">
                            <Button className="m-1" onClick={this.props.toggle_coords} active={this.props.coords} variant="secondary">coords</Button>
                            <Button className="m-1" onClick={this.props.toggle_fog} active={this.props.fog} variant="secondary">fog</Button>
                        </Col>
                    </Row>
                    <Row className="m-1">
                        <Col className="border info">
                            computer <Spinner className={this.props.thinking ? "visible" : "invisible"} size="sm" animation="border" />
                        </Col>
                    </Row>
                </>
            )
    }
}