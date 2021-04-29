import * as p5 from 'p5'
import _ from 'lodash'

import fetchData from './data'

import Particle from '../Particle'
import { Loop } from '../Draw'
import { blend } from './utils'

const flow = async () => {
    const fetchedData = await fetchData()

    // flowfield settings
    const flowfieldSettings = {
        width: 40,
        height: 20,
        inner: 40,
        getOuterWidth: () => flowfieldSettings.width * flowfieldSettings.inner,
        getOuterHeight: () => flowfieldSettings.height * flowfieldSettings.inner
    }

    const createParticles2 = (size, sketch) => {
        const particles = [...Array(size)].map(() => new Particle(
            new p5.Vector(
                sketch.random(0, flowfieldSettings.getOuterWidth()),
                sketch.random(0, flowfieldSettings.getOuterHeight())
            ),
            new p5.Vector(0, 0),
            new p5.Vector(0, 0),
            0,
            [flowfieldSettings.getOuterWidth(), flowfieldSettings.getOuterHeight()],
            sketch.random(1, 6)
        ))

        const forEach = (fn) => particles.forEach(fn)

        const update = (flowfield, t) => {
            const activity = flowfield.energy(t)
            
            particles.forEach(particle => {
                particle.health = particle.health * 0.5 + (activity > 0.2 ? activity * 2 : 0) * 0.5
                particle.health = Math.min(2.5, particle.health)
            })
        }

        return {
            forEach,
            update,
            length: () => particles.length
        }
    }

    const createParticles = (size, sketch) => {
        let particles = []

        const forEach = (fn) => particles.forEach(fn)

        const create = (flowfield, t) => {
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
            particles.push(create(flowfield, t))
        }

        const update = (flowfield, t) => {
            const activity = flowfield.energy(t)
            particles = particles.filter(particle => particle.isAlive())

            // TODO: bessere Funktion/Prädikat schreiben, welche neue Partikel emittiert. Hier wird nur EIN particle emittiert,
            // wenn die übergebene flowfield-activity > threshold ist und die maximale Anzahl von Partikeln nicht erreicht ist.

            if (activity > 0.1 && particles.length < size * activity) {
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
            length: () => particles.length
        }
    }

    // data:
    // eine liste von daten/sensordaten-feldern (hier länge des kraftvektors)
    // über welche interpoliert wird
    // settings
    const flowfield = (({ data, max }, { width, height }) => {
        // chunk values into "field states"
        const fields = _.chunk(data.map(d => d / max), flowfieldSettings.width * flowfieldSettings.height).map(chunk => _.shuffle(chunk))

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

        const update = (t) => {
            if (t > fields.length) {
                return false
            }
            // clear cache
            for (let i = 0; i < width; i++) {
                for (let j = 0; j < height; j++) {
                    cache[i][j] = {}
                    forceCache[i][j] = null
                }
            }
            return true
        }

        const energy = (t) => {
            const [a, b] = blend(t)
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

            const [a, b] = blend(t)

            const v1 = (fields[a[1]] ? fields[a[1]][x * height + y] : 0) * a[0]
            const v2 = (fields[b[1]] ? fields[b[1]][x * height + y] : 0) * b[0]

            let neighboursValues = 0
            const neighs = []
            if (neighbours) {
                for (let i = x - 3; i < x + 3; i++) {
                    for (let j = y - 3; j < y + 3; j++) {
                        if (i >= 0 && j >= 0 && i < width && j < height) {
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

        const getForce = (x, y, t) => forceCache[x][y] || (forceCache[x][y] = p5.Vector.fromAngle(get(x, y, t) * 8 * Math.PI))

        return {
            get: getForce,
            update,
            energy
        }
    })(fetchedData, flowfieldSettings)

    new p5(sketch => {
        let start = null
        let t = 0

        const particles = createParticles2(8000, sketch)

        sketch.setup = () => {
            sketch.createCanvas(flowfieldSettings.getOuterWidth(), flowfieldSettings.getOuterHeight())
            sketch.background(0)
            sketch.fill(255, 255, 255, 255)
        }

        sketch.draw = () => {
            if (!start) {
                start = Date.now()
                console.log(start)
            }
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

            if (flowfield.update(t)) {
                sketch.fill(0)
                sketch.rect(0, 0, 150, 150)
                sketch.fill(255)
                sketch.text(t, 30, 30)
                // sketch.text(chunks.length, 30, 60)
                sketch.text(sketch.millis(), 30, 90)
                particles.update(flowfield, t)
                particles.forEach(particle => {
                    const v = flowfield.get(
                        Math.floor(particle.position.x / flowfieldSettings.inner),
                        Math.floor(particle.position.y / flowfieldSettings.inner),
                        t
                    )

                    particle.applyForce(v)
                    particle.update()
                    sketch.stroke(255, 255, 255, sketch.map(particle.health, 0, 2.5, 0, 10))
                    sketch.line(particle.prevPosition.x, particle.prevPosition.y, particle.position.x, particle.position.y)
                    particle.updatePrev()

                    // sketch.circle(particle.position.x, particle.position.y, 2)

                })
                sketch.pop()
            } else {
                sketch.noLoop()
                console.log(Date.now())
                alert('end')
                console.log(Date.now() - start)
                window.image = sketch.image
                // draw(image)
            }
        }
    })
}

const draw = (image) => {
    new p5(sketch => {
        sketch.setup = () => {
            const cnv = sketch.createCanvas(image.width, image.height)
            sketch.fill(255)
            sketch.noStroke()
            sketch.background(0)
            const max = Math.pow(image.max(), 0.5)
            console.log(max)
            for (let i = 0; i < image.width; i++) {
                for (let j = 0; j < image.height; j++) {
                    sketch.fill(255, 255, 255, sketch.map(Math.pow(image.pixels[i][j], 0.5), 0, max, 0, 255))
                    sketch.circle(i, j, 2)
                }
            }
        }
    })
}

flow()