import React from "react";
import Game from "./Game";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

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