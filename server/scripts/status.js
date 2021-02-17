const client = require("../src/models/redis")
const redis = require("../src/models/redis")
const _ = require("lodash")
const moment = require("moment")
const chalk = require("chalk")

const id_to_color = (id) => Array.from(id).reduce((acc, v) => (acc + v.charCodeAt(0)) % 256, 0)

const client_display = (client) => {
  console.log(
    `${chalk.ansi256(id_to_color(client.id))(client.id)} ${moment
      .unix(client.ts / 1000)
      .fromNow()}`
  );
  if (client.queue)
    console.log(
      `\tin queue since ${moment.unix(client.queue.ts / 1000).fromNow()}`
    );
  if (client.game)
    console.log(
      `\tin game vs ${chalk.ansi256(id_to_color(client.game.opponent))(
        client.game.opponent
      )} (${client.game.color}, ${
        client.game.turn === "true" ? "playing" : "waiting"
      }) since ${moment.unix(client.game.ts / 1000).fromNow()}`
    );
};

const enumerate_clients = async () => {
  const keys = (await redis.keys(`client:*`)).map((key) => {
    const [, id] = key.split(":");
    return { id, key };
  });
  const clients = await Promise.all(
    keys.map(async ({ key, id }) => {
      const [ts] = await redis.hmget(`client:${id}`, "ts");
      const [opponent, color, turn, game_ts] = await redis.hmget(
        `game:${id}`,
        "opponent",
        "color",
        "turn",
        "ts"
      );
      const queue_ts = await redis.get(`queue:${id}`);
      const out = {
        key,
        id,
        ts,
      };
      if (opponent)
        out.game = {
          opponent,
          color,
          turn,
          ts: game_ts,
        };
      if (queue_ts) out.queue = { ts: queue_ts };
      return out;
    })
  );
  clients.sort((c1, c2) => c2.ts - c1.ts);
  return clients;
};

const status = async () => {
  const clients = await enumerate_clients()

  console.log()
  console.log()
  console.log()
  console.log(`*** clients *** `)
  console.log()
  clients.forEach(client_display)
}

(async () => {
  setInterval(status, 1000)
})()