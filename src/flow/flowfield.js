import * as p5 from 'p5'

import { blend } from './utils'

// data:
// eine liste von daten/sensordaten-feldern (hier länge des kraftvektors)
// über welche interpoliert wird
// settings
const createFlowfield = (fields, energies, { width, height, distortion, neighbours }) => {
    // return current loop index
    const update = (t) => {
        return Math.floor(t / fields.length)
    }

    const energy = (t) => {
        const [a, b] = blend(t % (fields.length - 1))
        const en = energies[a[1]] * a[0] + energies[b[1]] * b[0]
        return en
    }

    const get = (x, y, t) => {
        const [a, b] = blend(t % (fields.length - 1))

        let value = 0
        let length = 0

        for (let i = x - neighbours; i < x + neighbours; i++) {
            for (let j = y - neighbours; j < y + neighbours; j++) {
                length += 1
                const _x = (i + width) % width
                const _y = (j + height) % height

                const v1 = (fields[a[1]] ? fields[a[1]][_x * height + _y] : 0) * a[0]
                const v2 = (fields[b[1]] ? fields[b[1]][_x * height + _y] : 0) * b[0]

                const dist = 1 / (Math.max(Math.abs(i - x), Math.abs(j - y)) + 1)
                value += (v1 + v2) * dist
            }
        }

        return value / length
    }

    const getForce = (x, y, t) => p5.Vector.fromAngle(get(x, y, t) * distortion * Math.PI)

    return {
        get: getForce,
        update,
        energy
    }
}

export default createFlowfield