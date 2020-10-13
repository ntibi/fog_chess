import React, { Component } from "react";
import "./Over.css";

export default function Over(props) {
  return (
    <div
      className="over"
    >
      <div>
        <p>you {props.won ? "won" : "lost"}</p>
        <button onClick={props.restart}>restart</button>
      </div>
    </div>
  );
}