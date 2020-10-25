import React, { useState } from "react";
import { axios } from "../../utils/axios";
import { HourglassEmpty } from "@material-ui/icons";
import "./Matchmaking.css";

export default function Matchmaking({ socket }) {
  const [ waiting, set_waiting ] = useState(false);
  const [ connected, set_connected ] = useState(false);

  const queue = async () => {
    set_waiting(true);
    await axios.post("/mm/queue");
  };

  let message;

  if (connected)
    message = <p>playing</p>;
  else if (waiting)
    message = <p>finding an opponent <HourglassEmpty className="waiting" /></p>;
  else
    message = <button onClick={queue}>matchmaking</button>;
  return (
    <div>
      {message}
    </div>
  );
}