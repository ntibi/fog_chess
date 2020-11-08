import React, { useEffect } from "react";
import { useAxios } from "../../utils/axios";

export default function WaitingCount() {
  const [{ data, loading, error }, refresh] = useAxios("/api/mm/count");

  useEffect(() => {
    const interval = setInterval(refresh, 1000);
    return () => {     
      clearInterval(interval);
    };
  });

  let players;
  if (data === 1)
    players = "player";
  else
    players = "players";

  return (
    <p>
      {data} {players} in queue
    </p>
  );
}
