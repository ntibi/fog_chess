# [FOG CHESS](https://chess.ntibi.fr)

chess variant with imperfect information known as [dark chess](https://en.wikipedia.org/wiki/Dark_chess) or [kriegspiel](https://en.wikipedia.org/wiki/Kriegspiel_(chess))

[play it here](https://chess.ntibi.fr)


## TODO

- [ ] use zobrist hashing for transposition


- [ ] benchmark perf


- [ ] wasm in webworker


- [ ] allow drawing/marking on board


- [ ] measure the real tile size (might be 1px off)


- [ ] limit bundle size (check out lazy load)


- [ ] cache moves and benchmark perf (LRU ?)


- [ ] add amdmin page (players connected, matches, ...)


- [ ] handle online restart


- [ ] handle game leave


- [ ] warn user on socket disconnect


- [ ] switch memorystore to redis


- [ ] when resizing to a really small window the pieces positions are shifted


- [ ] store (and check ?) the game in backend to allow recovery


- [ ] add popups/toasts/... to display info from backend


- [ ] get good in frontend and design ¯\_(ツ)_/¯
