import React, { useState } from "react";
import "./Online.css";
import config from "../../../../config";
import axios from "axios";
import { Refresh, Warning } from "@material-ui/icons";

const { server: { url } } = config;

const pingColor = (ping) => {
  if (ping < 20) {
    return "#08c230";
  } else if (ping < 100) {
    return "#fc9003";
  } else {
    return "#ff3300";
  }
};

export default function Online(props) {
  const [ online, set_online ] = useState(false);
  const [ ping, set_ping ] = useState();
  const [ error, set_error ] = useState(false);

  const perform_ping = async () => {
    const t0 = performance.now();
    const { data } = await axios.get(`${url}/isup`);
    const t1 = performance.now();
    if (data != "OK")
      throw new Error("healthcheck did not return ok");
    set_ping((t1 - t0) / 1000);
  };

  const connect = async () => {
    try {
      await perform_ping();
      set_online(true);
      setInterval(perform_ping, 10000);
    } catch (error) {
      set_error(true);
    }
  };

  const buttonStyle = {
    visibility: online ? "hidden" : "visible",
  };

  let message;
  if (error) {
    message = <p>connection error <Warning style={{color: "#ff3300"}} /></p>;
  } else if (online) {
    message = <p>currently online</p>;
  } else if (!online) {
    message = <p>currently offline</p>;
  }

  return (
    <div className="online_menu">
      {message}
      {online &&
              <p onClick={perform_ping}>
                <span style={{ color: pingColor(ping) }}>
                      ping : {Math.floor(ping)}ms </span>
                <Refresh fontSize="small" />
              </p>}
      {!online &&
              <button style={buttonStyle} onClick={connect}>go online</button>}
    </div>
  );
}