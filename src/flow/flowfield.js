import * as p5 from 'p5'

import { blend } from './utils'

// data:
// eine liste von daten/sensordaten-feldern (hier länge des kraftvektors)
// über welche interpoliert wird
// settings
const createFlowfield = (fields, { width, height, distortion }) => {
    let cache = {}
    // create initial cache values
    for (let i = 0; i < width; i++) {
        cache[i] = {}
        for (let j = 0; j < height; j++) {
            cache[i][j] = {}
        }
    }

    let forceCache = {}
    // create initial cache values
    for (let i = 0; i < width; i++) {
        forceCache[i] = {}
        for (let j = 0; j < height; j++) {
            forceCache[i][j] = null
        }
    }

    // return current loop index
    const update = (t) => {
        // clear cache
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                cache[i][j] = {}
                forceCache[i][j] = null
            }
        }
        return Math.floor(t / fields.length)
    }

    const energy = (t) => {
        const [a, b] = blend(t % fields.length)
        const v1 = fields[a[1]] ? fields[a[1]].reduce(
            (acc, val) => {
                acc += val
                return acc
            }, 0
        ) : 0

        const v2 = fields[b[1]] ? fields[b[1]].reduce(
            (acc, val) => {
                acc += val
                return acc
            }, 0
        ) : 0

        return (v1 * a[0] + v2 * b[0]) / (width * height)
    }

    const get = (x, y, t, neighbours = true) => {
        if (cache[x][y][neighbours ? 'neighbours' : 'computed']) {
            return cache[x][y][neighbours ? 'neighbours' : 'computed']
        }

        const [a, b] = blend(t % fields.length)

        const v1 = (fields[a[1]] ? fields[a[1]][x * height + y] : 0) * a[0]
        const v2 = (fields[b[1]] ? fields[b[1]][x * height + y] : 0) * b[0]

        let neighboursValues = 0
        const neighs = []
        if (neighbours) {
            for (let i = x - 3; i < x + 3; i++) {
                for (let j = y - 3; j < y + 3; j++) {
                    const x = (i + width) % width
                    const y = (j + height) % height

                    neighs.push([x, y])

                }
            }
            neighboursValues = neighs.reduce(
                (acc, neigh) => {
                    acc += get(neigh[0], neigh[1], t, false)
                    return acc
                }, 0
            )
        }

        // const value = neighboursValues ? (v1 + v2 + neighboursValues) / 2 : v1 + v2
        const value = (neighboursValues + v1 + v2) / (neighs.length + 1)
        cache[x][y][neighbours ? 'neighbours' : 'computed'] = value

        return value
    }

    const getForce = (x, y, t) => forceCache[x][y] || (forceCache[x][y] = p5.Vector.fromAngle(get(x, y, t) * distortion * Math.PI))

    return {
        get: getForce,
        update,
        energy
    }
}

export default createFlowfield