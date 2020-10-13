export const forEachTile = (width, height, cb) => 
    [...Array(height + 1).keys()].forEach(y => {
        [...Array(width + 1).keys()].forEach(x => {
            cb(x, y)
        })
    })