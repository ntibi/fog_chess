import React, { Component } from 'react';
import "./Interface.css"

export default function Interface(props) {
    console.log(props.level)
    return (
        <div className="interface">
            <div className="group">
                <p>computer level {props.level.current}</p>
                <input type="range" min={String(props.level.min)} max={String(props.level.max)} value={String(props.level.current)} className="slider" onChange={(e) => {props.set_level(Number(e.target.value))}} />
                <div className={`spinner ${props.thinking && "spinning"}`}></div>
            </div>
            <div className="group">
                <button className={`control-button ${props.coords ? "checked" : "unchecked"}`} onClick={props.toggle_coords} active={props.coords}>coords</button>
                <button className={`control-button ${props.fog ? "checked" : "unchecked"}`} onClick={props.toggle_fog} active={props.fog}>fog</button>
            </div>
        </div>
    )
}