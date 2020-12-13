import React, { useCallback, useState } from "react";
import { axios } from "../../utils/axios";
import WaitingCount from "./WaitingCount";
import { Button, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
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
      <p>finding an opponent <Icon icon={IconNames.PERSON} className="waiting_icon" /></p>
      <WaitingCount/>
    </div>;
  else
    message = <div>
      <Button onClick={queue}>matchmaking</Button>
    </div>;
  return (
    <div className="matchmaking">
      {message}
    </div>
  );
}
