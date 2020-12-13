import React, { useState, useEffect, useCallback } from "react";
import "./Online.css";
import Matchmaking from "./Matchmaking";
import { useAxios } from "../../utils/axios";
import io from "socket.io-client";
import { Card, Button, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

export default function Online({ start, started }) {
  const [{ data, loading, error }, refetch] = useAxios("/api/isup", {
    manual: true,
  });
  const [socket, set_socket] = useState();
  const [connected, set_connected] = useState();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        socket.on("start", ({ color }) => start(socket, color));
        set_connected(true);
      });
      socket.on("disconnect", () => set_connected(false));
      socket.on("info", (data) => console.log(data));
    }
  }, [socket]);

 
  let message;
  if (error) {
    message = <p>
        connection error <Icon icon={IconNames.ERROR} iconSize={20} intent="danger" />
    </p>;
  } else if (data) {
    message = <p>
        currently online <Icon icon={IconNames.GLOBE_NETWORK} iconSize={20} intent="success" />
    </p>;
  } else if (!data) {
    message = <p>currently offline <Icon icon={IconNames.GLOBE_NETWORK} iconSize={20} intent="warning" /></p>;
  }

  const connect = useCallback(async () => {
    await refetch();

    const socket = io(window.location.href, { path: "/api/socket.io" });
    set_socket(socket);
  }, [refetch, set_socket, window.location.href]);

  return (
    <Card elevation={1} className="online_menu">
      <div className="online">
        {message}
        <Button loading={loading} active={data} onClick={(data || loading) ? refetch : connect}>
            go online
        </Button>
      </div>
      {!started && data && connected && (
        <Matchmaking socket={socket} started={started} />
      )}
    </Card>
  );
}
