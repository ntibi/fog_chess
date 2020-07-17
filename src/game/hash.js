const zobrist = []

export function init() {
    const values = []
    for (let i = 0; i < 64; ++i) {
        zobrist[i] = []
        for (let p of all_pieces) {
            let v
            do {
                v = Math.round(Math.random() * (2 ** 32 - 1))
            } while(values.includes(v))
            values.push(v)
            zobrist[i][p] = v
        }
    }
}

export function hash(pieces) {
    return pieces.reduce((acc, v) => acc ^ zobrist[v.coords.x + v.coords.y * 8][`${v.type}${v.color}`], 0)
}