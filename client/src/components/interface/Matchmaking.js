import React, { useState } from "react";
import { axios, useAxios } from "../../utils/axios";
import { HourglassEmpty } from "@material-ui/icons";
import WaitingCount from "./WaitingCount";
import "./Matchmaking.css";

export default function Matchmaking({ socket }) {
  const [ waiting, set_waiting ] = useState(false);
  const [ connected, set_connected ] = useState(false);

  const queue = async () => {
    set_waiting(true);
    await axios.post("/api/mm/queue");
  };

  let message;

  if (connected)
    message = <div>
      <p>playing</p>
    </div>;
  else if (waiting)
    message = <div>
      <p>finding an opponent <HourglassEmpty className="waiting_icon" /></p>
      <WaitingCount/>
    </div>;
  else
    message = <div>
      <button onClick={queue}>matchmaking</button>
    </div>;
  return (
    <div>
      {message}
    </div>
  );
}
