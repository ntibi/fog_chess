import React from "react";
import "./Interface.css";
import Thinking from "./Thinking";
import CapturedCounts from "./CapturedCounts";
import { color_name } from "../../game/rules";
import { Card, Button, ButtonGroup, Slider, Switch } from "@blueprintjs/core";

export default function Interface({
  pieces,
  online,
  engine_config,
  controls,
  thinking,
  coords_enabled,
  fog_enabled,
  level,
  set_level,
  switch_controls,
  toggle_coords,
  toggle_fog
}) {

  return (
    <Card className="controls">
      {/* <Card className="thinking">
        <Thinking thinking={thinking} />
      </Card> */}
      {!online && <Card className="computer">
        <p>computer depth {level.current}</p>
        <Slider
          min={engine_config.level.min}
          max={engine_config.level.max}
          value={level}
          onChange={set_level}
        />
      </Card>}
      <Card className="buttons">
        <ButtonGroup vertical={true}>
          <Switch checked={coords_enabled} onChange={toggle_coords}>coords</Switch>
          {!online && <Switch checked={fog_enabled} onChange={toggle_fog}>fog</Switch>}
          {!online && <Button onClick={switch_controls}>{color_name[controls]}</Button>}
        </ButtonGroup>
      </Card>
      <Card className="captured">
        <CapturedCounts controls={controls} pieces={pieces} />
      </Card>
    </Card>
  );
}