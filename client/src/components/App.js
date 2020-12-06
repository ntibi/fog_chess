import React from "react";
import Game from "./Game";
import "./App.css";
import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";

export default function App() {
  return (
    <div>
      <Game />
      <div className="source">
        <a href="https://github.com/ntibi/fog_chess">source</a>
      </div>
    </div>
  );
}