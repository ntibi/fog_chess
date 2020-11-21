import React from "react";
import "./Interface.css";
import Thinking from "./Thinking";
import CapturedCounts from "./CapturedCounts";
import { color_name } from "../../game/rules";

export default function Interface({
  pieces,
  online,
  engine_config,
  controls,
  thinking,
  coords,
  fog,
  level,
  set_level,
  switch_controls,
  toggle_coords,
  toggle_fog
}) {

  return (
    <div className="interface">
      <div className="group">
        <CapturedCounts controls={controls} pieces={pieces} />
      </div>
      <div className="group">
        <Thinking thinking={thinking} />
        {!online && <p>computer depth {level.current}</p>}
        {!online && <input
          type="range"
          min={String(engine_config.level.min)}
          max={String(engine_config.level.max)}
          value={String(level)}
          className="slider"
          onChange={(e) => {set_level(Number(e.target.value));}} />}
      </div>
      <div className="group">
        <button className={`control-button ${coords ? "checked" : "unchecked"}`} onClick={toggle_coords}>coords</button>
        {!online && <button className={`control-button ${fog ? "checked" : "unchecked"}`} onClick={toggle_fog}>fog</button>}
        {!online && <button className={"control-button"} onClick={switch_controls}>{color_name[controls]}</button>}
      </div>
    </div>
  );
}