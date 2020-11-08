# [FOG CHESS](https://ntibi.github.io/fog_chess/)

chess variant with imperfect information known as [dark chess](https://en.wikipedia.org/wiki/Dark_chess) or [kriegspiel](https://en.wikipedia.org/wiki/Kriegspiel_(chess))

[play it here](https://ntibi.github.io/fog_chess/)


## TODO

- [ ] use zobrist hashing for transposition


- [ ] benchmark perf


- [ ] move computation heavy functions away from the render functions


- [ ] wasm in webworker


- [ ] allow drawing/marking on board


- [ ] measure the real tile size (might be 1px off)


- [ ] the pieces seem ~1px off from the tile center


- [ ] limit bundle size (check out lazy load)


- [ ] iterative deepening or breadth first ?


- [ ] cache moves and benchmark perf (LRU ?)


- [ ] add a restart button


- [ ] add amdmin page (players connected, matches, ...)


- [ ] list eaten pieces


- [ ] handle online restart


- [ ] handle game leave


- [ ] rotate board for black


- [ ] switch memorystore to redis
