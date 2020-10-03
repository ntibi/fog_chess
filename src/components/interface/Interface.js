import React, { Component } from 'react';
import "./Interface.css"

export default function Interface(props) {
    return (
        <div className="interface">
            <div className="group">
                computer {props.thinking && "thinking"}
            </div>
            <div className="group">
                <button className={`control-button ${props.coords ? "checked" : "unchecked"}`} onClick={props.toggle_coords} active={props.coords}>coords</button>
                <button className={`control-button ${props.fog ? "checked" : "unchecked"}`} onClick={props.toggle_fog} active={props.fog}>fog</button>
            </div>
        </div>
    )
}