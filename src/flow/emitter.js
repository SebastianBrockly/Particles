import * as p5 from 'p5'

import Particle from './particle'
import seedrandom from 'seedrandom'

const createRandom = (seed) => {
    const rnd = seedrandom(seed)

    return (from, to) => {
        return from + ((to - from) * rnd())
    }
}

const createStaticEmitter = (size, settings) => {
    Particle.setGlobalSettings(settings)

    const random = createRandom('emitter')
    const particles = [...Array(size)].map(() => new Particle(
        new p5.Vector(
            random(0, settings.getOuterWidth()),
            random(0, settings.getOuterHeight())
        ),
        new p5.Vector(0, 0),
        new p5.Vector(0, 0),
        0,
        [settings.getOuterWidth(), settings.getOuterHeight()],
        random(1, settings.maxMass)
    ))

    const update = () => {}

    return {
        update,
        particles,
        length: () => particles.length
    }
}

export default (type) => {
    if (type === 'static') {
        return createStaticEmitter
    }
}