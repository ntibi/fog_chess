import React, { useCallback, useState } from "react";
import { axios } from "../../utils/axios";
import { HourglassEmpty } from "@material-ui/icons";
import WaitingCount from "./WaitingCount";
import "./Matchmaking.css";

export default function Matchmaking({ started }) {
  const [ waiting, set_waiting ] = useState(false);

  const queue = useCallback(async () => {
    set_waiting(true);
    await axios.post("/api/mm/queue");
  }, [set_waiting]);

  let message;

  if (started)
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
