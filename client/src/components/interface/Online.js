import React, { useState } from "react";
import "./Online.css";
import { Refresh, Warning } from "@material-ui/icons";
import Matchmaking from "./Matchmaking";
import { useAxios } from "../../utils/axios";
import io from "socket.io-client";

export default function Online(props) {
  const [{ data, loading, error }, refetch] = useAxios("/api/isup", { manual: true });
  const [ socket, set_socket ] = useState();
  const [ connected, set_connected ] = useState();

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

  const connect = () => {
    refetch();

    const socket = io(window.location.href, { path: "/api/socket.io"});
    socket.on("connect", () => set_connected(true));
    socket.on("start", ({color}) => props.start(socket, color));
    socket.on("disconnect", () => set_connected(false));
    set_socket(socket);
  };

  return (
    <div className="online_menu">
      {message}
      {!data && !loading &&
              <button style={buttonStyle} onClick={connect}>go online</button>}
      {!props.started && data && <Matchmaking
        socket={socket}
      />}
    </div>
  );
}
