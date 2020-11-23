import React from "react";
import "./Over.css";

export default function Over({ won, restart }) {
  return (
    <div
      className="over"
    >
      <div>
        <p>you {won ? "won" : "lost"}</p>
        <button onClick={restart}>restart</button>
      </div>
    </div>
  );
}