import React from "react";
import "./Thinking.css";

export default function Interface({ thinking }) {
  if (thinking) {
    return (
      <div className="thinking">
        <p className="waiting">
          waiting for opponent
        </p>
      </div>);
  } else {
    return (
      <div className="thinking">
        <p className="play">
              your turn to play
        </p>
      </div>);
  }
}