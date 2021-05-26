import p5 from 'p5'
import _ from 'lodash'
import { v1 as uuid } from 'uuid'

import createFlowfield from './flowfield'
import createEmitter from './emitter'

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

            const width = settings.flowfieldWidth
            const height = settings.flowfieldHeight

            const innerWidth = settings.getOuterWidth() / settings.flowfieldWidth
            const innerHeight = settings.getOuterHeight() / settings.flowfieldHeight 

            const shuffle = createShuffle(99)
            
            const fields = _.chunk(data.map(d => d), width * height)
                .map(shuffle).filter(chunk => chunk.length === width * height)
            
            const energies = fields.map(average)

            let cnv
            let t = 0

            const flowfield = createFlowfield(fields, energies, settings)
            const emitter = createEmitter('static')(settings.particles, settings)
            const margin = settings.getOuterWidth() * 0.1

            sketch.setup = () => {
                
                cnv = sketch.createCanvas(settings.getOuterWidth() + margin, settings.getOuterHeight() + (margin * 2))
                sketch.stroke(0)
                sketch.noStroke()
                sketch.background(255, 255, 255, 255)
                sketch.fill(0)
                sketch.rect(margin / 2, margin / 2, settings.getOuterWidth(), settings.getOuterHeight())
            }

            sketch.draw = () => {
                t += settings.step

                const e = flowfield.energy(t)
                if (flowfield.update(t) < 1) {
                    emitter.update()
                    emitter.particles.forEach(particle => {
                        const v = flowfield.get(
                            Math.floor(particle.position.x / innerWidth),
                            Math.floor(particle.position.y / innerHeight),
                            t
                        )
                        particle.applyForce(v)
                        particle.applyEnergy(e)
                        particle.update()
                        sketch.noStroke()
                        sketch.stroke(255, 255, 255, sketch.map(particle.health, 0, settings.maxHealthRange, 0, 20))
                        sketch.line(particle.prevPosition.x + (margin / 2), particle.prevPosition.y + (margin / 2), particle.position.x + (margin / 2), particle.position.y + (margin / 2))

                        sketch.circle()
                        
                        particle.updatePrev()
                    })
                } else {
                    sketch.noLoop()
                    sketch.fill(0, 0, 0, 255)
                    sketch.textAlign(sketch.CENTER)
                    const fontSize = sketch.map(settings.getOuterWidth(), 0, 6000, 10, 140)
                    sketch.textFont('Courier', sketch.map(settings.getOuterWidth(), 0, 6000, 10, 140))
                    sketch.textStyle(sketch.BOLD)
                    sketch.text(settings.title, settings.getOuterWidth() / 2 + margin / 2, settings.getOuterHeight() + margin + fontSize)
                    sketch.textFont('Courier', sketch.map(settings.getOuterWidth(), 0, 6000, 10, 140) / 2)
                    const date = new Date()
                    const month = String(date.getMonth() + 1).length === 2 ? `${date.getMonth() + 1}` : `0${date.getMonth() + 1}`
                    sketch.textStyle(sketch.ITALIC)
                    sketch.text(`${date.getFullYear()}-${month}-${date.getDate()}`, settings.getOuterWidth() / 2 + margin / 2, settings.getOuterHeight() + margin + fontSize + fontSize)
                    sketch.save(settings, `${id}.json`)
                    resolve({
                        canvas: cnv,
                        sketch: sketch
                    })
                }
            }
        })
    })
}

export default createParticleSystem