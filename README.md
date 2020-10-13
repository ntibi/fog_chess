# [FOG CHESS](https://ntibi.github.io/fog_chess/)

chess variant with imperfect information known as [dark chess](https://en.wikipedia.org/wiki/Dark_chess) or [kriegspiel](https://en.wikipedia.org/wiki/Kriegspiel_(chess))

## TODO

- [ ] add position evaluation pondering


- [ ] use zobrist hashing for transposition


- [ ] benchmark perf


- [ ] move computation heavy functions away from the render functions


- [ ] wasm in webworker


- [ ] lint + clean code (camelcase snakecase)


- [ ] allow drawing/marking on board


- [ ] measure the real tile size (might be 1px off)


- [ ] the pieces seem ~1px off from the tile center


- [ ] refactor w/ hooks


- [ ] split Board.js to avoid full re-render


- [ ] limit bundle size (check out lazy load)


- [ ] iterative deepening or breadth first


- [ ] cache moves and benchmark perf (LRU ?)


- [ ] select online or AI


- [ ] backend


- [ ] redis for mm


- [ ] your turn to play should be obvious (maybe flash an info)


- [ ] add a restart button


- [ ] wrap board to only have it display the board


- [ ] animate piece moves ?
