import p5 from 'p5'
import _ from 'lodash'
import { v1 as uuid } from 'uuid'

import createFlowfield from './flowfield'
import createParticles from './particles'

import seedrandom from 'seedrandom'

import { average } from './utils'

const createShuffle = (seed) => {
    const random = seedrandom(seed)
    return (array) => array
        .map(a => ({ value: a, r: random() }))
        .sort((a, b) => a.r - b.r)
        .map(v => v.value)
}

const createParticleSystem = async (dataset, settings) => {
    const id = uuid()
    return new Promise(resolve => {
        new p5(sketch => {
            const { data, max } = dataset

            const width = settings.width
            const height = settings.height

            const shuffle = createShuffle(99)

            const fields = _.chunk(data.map(d => d / max), width * height).map(shuffle).filter(chunk => chunk.length === width * height)
            const energies = fields.map(average)

            // const energies = fil

            let cnv
            let t = 0

            // progress: t / fields.length
            let step = 0
            const flowfield = createFlowfield(fields, energies, settings)
            const particles = createParticles(settings.particles, settings)

            sketch.setup = () => {
                cnv = sketch.createCanvas(settings.getOuterWidth() + 100, settings.getOuterHeight() + 100)
                sketch.background(255)
                sketch.fill(0)
                sketch.stroke(0)
                sketch.push()
                sketch.translate(50, 50)
                sketch.stroke(0)
                sketch.rect(0, 0, settings.getOuterWidth(), settings.getOuterHeight())
                // sketch.blendMode(sketch.REMOVE)
                sketch.colorMode(sketch.RGB, 255, 255, 255, 2000)
                sketch.pop()
            }

            sketch.draw = () => {
                sketch.push()
                sketch.translate(50, 50)
                t += settings.timestep
                step += 1

                if (flowfield.update(t) < 1) {
                    particles.update(flowfield.energy(t))
                    particles.forEach(particle => {
                        const v = flowfield.get(
                            Math.floor(particle.position.x / settings.inner),
                            Math.floor(particle.position.y / settings.inner),
                            t
                        )

                        particle.applyForce(v)
                        particle.update()
                        sketch.stroke(255, 255, 255, sketch.map(particle.health, 0, 0.8, 0, 20))
                        sketch.line(particle.prevPosition.x, particle.prevPosition.y, particle.position.x, particle.position.y)
                        particle.updatePrev()
                    })
                } else {
                    sketch.noLoop()
                    sketch.save(cnv, `${id}.jpg`)
                    sketch.save(settings, `${id}.json`)
                    sketch.remove()
                    resolve()
                }
                sketch.pop()
            }
        })
    })
}

export default createParticleSystem