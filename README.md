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


- [ ] limit bundle size (check out lazy load)


- [ ] cache moves and benchmark perf (LRU ?)


- [ ] add amdmin page (players connected, matches, ...)


- [ ] handle online restart


- [ ] handle game leave


- [ ] warn user on socket disconnect


- [ ] switch memorystore to redis


- [ ] cache hooks w/ useCallback, useMemo, ...


- [ ] get good in frontend and design ¯\_(ツ)_/¯
