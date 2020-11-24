import React, { useState, useEffect, useCallback } from "react";
import "./Online.css";
import { Refresh, Warning } from "@material-ui/icons";
import Matchmaking from "./Matchmaking";
import { useAxios } from "../../utils/axios";
import io from "socket.io-client";

export default function Online({ start, started }) {
  const [{ data, loading, error }, refetch] = useAxios("/api/isup", { manual: true });
  const [ socket, set_socket ] = useState();
  const [ connected, set_connected ] = useState();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        socket.on("start", ({color}) => start(socket, color));
        set_connected(true);
      });
      socket.on("disconnect", () => set_connected(false));
      socket.on("info", (data) => console.log(data));
    }
  }, [socket]);

  const buttonStyle = {
    visibility: data ? "hidden" : "visible",
  };

  let message;
  if (loading) {
    message = <p>reaching backend ...</p>;
  } else if (error) {
    message = <p>connection error <Warning style={{color: "#ff3300"}} /></p>;
  } else if (data) {
    message = <p onClick={refetch}>currently online<Refresh fontSize="small"/> </p>;
  } else if (!data) {
    message = <p>currently offline</p>;
  }

  const connect = useCallback(async () => {
    await refetch();

    const socket = io(window.location.href, { path: "/api/socket.io"});
    set_socket(socket);
  }, [refetch, set_socket, window.location.href]);

  return (
    <div className="online_menu">
      {message}
      {!data && !loading &&
              <button style={buttonStyle} onClick={connect}>go online</button>}
      {!started && data && connected && <Matchmaking
        socket={socket}
        started={started}
      />}
    </div>
  );
}
