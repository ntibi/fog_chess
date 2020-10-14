import React from "react";
import "./Fog.css";

const min = 50;
const max = 80;

export default function Fog(props) {
  const strength = (1 - props.strength) * (max - min) + min;
  const style = {
    width: `${props.tilesize}px`,
    height: `${props.tilesize}px`,
    backgroundColor: `rgb(${strength},${strength},${strength})`,
  };
  return (
    <div
      style={style}
      className={"fog"}
    />
  );
}