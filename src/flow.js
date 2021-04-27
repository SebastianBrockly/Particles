import * as p5 from 'p5'
import _ from 'lodash'

import { getDataset } from './api'

import Particle from './Particle'
import Image, { Loop } from './Draw'

const flow = async () => {
    // read data
    const dataSettings = {
        zoom: 6,
        smoothing: 15
    }
    const data = await getDataset('dataset_home', dataSettings.smoothing, dataSettings.zoom)
    const max = data.reduce(
        (acc, val) => {
            return Math.max(acc, val)
        }, 0
    )

    // flowfield settings
    const flowfieldSettings = {
        width: 20,
        height: 10,
        inner: 80,
        getOuterWidth: () => flowfieldSettings.width * flowfieldSettings.inner,
        getOuterHeight: () => flowfieldSettings.height * flowfieldSettings.inner
    }

    const chunks = _.chunk(data.map(d => d / max), flowfieldSettings.width * flowfieldSettings.height).map(chunk => _.shuffle(chunk))

    // helpers
    const blend = n => {
        const w = n - Math.floor(n)
        return [
            [1 - w, Math.floor(n)],
            [w, Math.floor(n) + 1]
        ]
    }

    const createParticles = (size, sketch) => {
        let _particles = []

        const forEach = (fn) => _particles.forEach(fn)

        const create = (flowfield, t) => {
            // if (_particles.length === 0) {
            //     return new Particle(
            //         new p5.Vector(sketch.random((flowfieldSettings.getOuterWidth() / 2) - 50, (flowfieldSettings.getOuterWidth() / 2) + 50), sketch.random(flowfieldSettings.getOuterHeight() / 2, flowfieldSettings.getOuterHeight() / 2)),
            //         new p5.Vector(sketch.random(-1, 1), sketch.random(-1, 1)),
            //         new p5.Vector(0, 0),
            //         2,
            //         [flowfieldSettings.getOuterWidth(), flowfieldSettings.getOuterHeight()]
            //     )
            // }
            // return new Particle(
            //     _particles[0].position.copy(),
            //     _particles[0].velocity.copy().rotate(sketch.random(-1, 1)),
            //     new p5.Vector(0, 0),
            //     2.5,
            //     [flowfieldSettings.getOuterWidth(), flowfieldSettings.getOuterHeight()]
            // )

            const positionX = sketch.random(0, flowfieldSettings.getOuterWidth()) / flowfieldSettings.inner
            const positionY = sketch.random(0, flowfieldSettings.getOuterHeight()) / flowfieldSettings.inner

            const f = flowfield.get(Math.floor(positionX), Math.floor(positionY), t)
            const v = p5.Vector.fromAngle(f * 4 * sketch.PI)

            return new Particle(
                new p5.Vector(positionX * flowfieldSettings.inner, positionY * flowfieldSettings.inner),
                v,
                new p5.Vector(0, 0),
                2,
                [flowfieldSettings.getOuterWidth(), flowfieldSettings.getOuterHeight()]
            )
        }

        const emit = (flowfield, t) => {
            _particles.push(create(flowfield, t))
        }

        const update = (flowfield, t) => {
            const activity = flowfield.energy(t)
            _particles = _particles.filter(particle => particle.isAlive())

            // TODO: bessere Funktion/Prädikat schreiben, welche neue Partikel emittiert. Hier wird nur EIN particle emittiert,
            // wenn die übergebene flowfield-activity > threshold ist und die maximale Anzahl von Partikeln nicht erreicht ist.

            if (activity > 0.1 && _particles.length < size * activity) {
                // how much?
                const times = Math.floor(activity * 100 / 5)
                for (let i = 0; i < times; i++) {
                    emit(flowfield, t)
                }

            }
        }
        return {
            forEach,
            update,
            length: () => _particles.length
        }
    }

    const flowfield = (() => {
        let cache = {}
        // create initial cache values
        for (let i = 0; i < flowfieldSettings.width; i++) {
            cache[i] = {}
            for (let j = 0; j < flowfieldSettings.height; j++) {
                cache[i][j] = {}
            }
        }

        const update = () => {
            // clear cache
            for (let i = 0; i < flowfieldSettings.width; i++) {
                for (let j = 0; j < flowfieldSettings.height; j++) {
                    cache[i][j] = {}
                }
            }
        }

        const energy = (t) => {
            const [a, b] = blend(t)
            const v1 = chunks[a[1]] ? chunks[a[1]].reduce(
                (acc, val) => {
                    acc += val
                    return acc
                }, 0
            ) : 0

            const v2 = chunks[b[1]] ? chunks[b[1]].reduce(
                (acc, val) => {
                    acc += val
                    return acc
                }, 0
            ) : 0

            return (v1 * a[0] + v2 * b[0]) / (flowfieldSettings.width * flowfieldSettings.height)
        }

        const get = (x, y, t, neighbours = true) => {
            if (cache[x][y][neighbours ? 'neighbours' : 'computed']) {
                return cache[x][y][neighbours ? 'neighbours' : 'computed']
            }

            const [a, b] = blend(t)

            const v1 = (chunks[a[1]] ? chunks[a[1]][x * flowfieldSettings.height + y] : 0) * a[0]
            const v2 = (chunks[b[1]] ? chunks[b[1]][x * flowfieldSettings.height + y] : 0) * b[0]

            let neighboursValues = 0
            const neighs = []
            if (neighbours) {
                for (let i = x - 3; i < x + 3; i++) {
                    for (let j = y - 3; j < y + 3; j++) {
                        if (i >= 0 && j >= 0 && i < flowfieldSettings.width && j < flowfieldSettings.height) {
                            neighs.push([i, j])
                        }
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

        return {
            get,
            update,
            energy
        }
    })()

    new p5(sketch => {
        let t = 0
        let stopped = false
        const particles = createParticles(1000, sketch)

        sketch.setup = () => {
            sketch.createCanvas(flowfieldSettings.getOuterWidth(), flowfieldSettings.getOuterHeight())
            sketch.background(0)
            // sketch.noStroke()
            sketch.fill(255, 255, 255, 255)
        }

        sketch.keyPressed = () => {
            stopped = !stopped
        }

        sketch.draw = () => {
            if (stopped) return
            t += .01
            sketch.push()

            // sketch.background(0)
            // for (let i = 0; i < flowfieldSettings.width; i++) {
            //     for (let j = 0; j < flowfieldSettings.height; j++) {
            //         sketch.push()
            //         sketch.translate(i * flowfieldSettings.inner, j * flowfieldSettings.inner)
            //         const f = flowfield.get(i, j, t)
            //         sketch.stroke(255)
            //         sketch.rotate(f * 4 * sketch.PI)
            //         sketch.line(-9, 0, 9, 0)
            //         sketch.line(-9, -2, -9, 2)
            //         sketch.pop()
            //     }
            // }

            flowfield.update()
            // const e = flowfield.energy(t)

            particles.update(flowfield, t)

            particles.forEach(particle => {
                const f = flowfield.get(Math.floor(particle.position.x / flowfieldSettings.inner), Math.floor(particle.position.y / flowfieldSettings.inner), t)
                const v = p5.Vector.fromAngle(f * 2 * sketch.PI)
                particle.applyForce(v)
                particle.update()
                sketch.noStroke()
                sketch.fill(255, 255, 255, sketch.map(particle.health, 0, 2.5, 50, 50))
                sketch.circle(particle.position.x, particle.position.y, 2)
            })
            sketch.pop()

            // sketch.text(particles.length(), 40, 40)
            // sketch.text(e, 40, 80)
        }
    })
}

flow()