import Engine from "./engine.worker.js";

const engine = new Engine();

export async function get_move(pieces, turn, level) {
  return new Promise((resolve, reject) => {
    engine.onmessage = (e) => { resolve(e.data); };
    engine.onerror = (e) => { reject(e); };
    engine.postMessage({pieces, turn, level});
  });
}

export const config = {
  level: {
    min: 1,
    default: 3,
    max: 5,
  }
};