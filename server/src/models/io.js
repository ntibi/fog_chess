let _io

// this code is not in ./socket.js to avoid circular dependencies

module.exports = {
  set: (io) => _io = io,
  io: () => _io,
}