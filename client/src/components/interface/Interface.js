import React from "react";
import "./Interface.css";

const name = {
  w: "white",
  b: "black",
};

export default function Interface(props) {
  return (
    <div className="interface">
      <div className="group">
        <p>computer depth {props.level.current}</p>
        <input type="range" min={String(props.engine_config.level.min)} max={String(props.engine_config.level.max)} value={String(props.level)} className="slider" onChange={(e) => {props.set_level(Number(e.target.value));}} />
        <div className={`spinner ${props.thinking && "spinning"}`}></div>
      </div>
      <div className="group">
        <button className={`control-button ${props.coords ? "checked" : "unchecked"}`} onClick={props.toggle_coords}>coords</button>
        <button className={`control-button ${props.fog ? "checked" : "unchecked"}`} onClick={props.toggle_fog}>fog</button>
        <button className={"control-button"} onClick={props.switch_controls}>{name[props.controls]}</button>
      </div>
    </div>
  );
}