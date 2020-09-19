import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import "./Interface.css"

export default function Interface(props) {
    return (
        <ListGroup>
            <ListGroup.Item>
                computer <Spinner className={props.thinking ? "visible" : "invisible"} size="sm" animation="border" />
            </ListGroup.Item>
            <ListGroup.Item>
                <Button className="m-1" onClick={props.toggle_coords} active={props.coords} variant="secondary">coords</Button>
                <Button className="m-1" onClick={props.toggle_fog} active={props.fog} variant="secondary">fog</Button>
            </ListGroup.Item>
        </ListGroup>
    )
}