import React, { Component } from 'react';
import "./Interface.css"

export default function Interface(props) {
    return (
        <div className="interface">
            <div className="group">
                <p>computer depth {props.level.current}</p>
                <input type="range" min={String(props.level.min)} max={String(props.level.max)} value={String(props.level.current)} className="slider" onChange={(e) => {props.set_level(Number(e.target.value))}} />
                <div className={`spinner ${props.thinking && "spinning"}`}></div>
            </div>
            <div className="group">
                <button className={`control-button ${props.coords ? "checked" : "unchecked"}`} onClick={props.toggle_coords}>coords</button>
                <button className={`control-button ${props.fog ? "checked" : "unchecked"}`} onClick={props.toggle_fog}>fog</button>
            </div>
        </div>
    )
}