import React from "react";
import "./Fog.css";

const min = 50;
const max = 80;

export default function Fog({ strength, tilesize }) {
  const value = (1 - strength) * (max - min) + min;
  const style = {
    width: `${tilesize}px`,
    height: `${tilesize}px`,
    backgroundColor: `rgb(${value},${value},${value})`,
  };
  return (
    <div
      style={style}
      className={"fog"}
    />
  );
}