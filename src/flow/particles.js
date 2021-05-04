import * as p5 from 'p5'

import Particle from './particle'
import seedrandom from 'seedrandom'

const createRandom = (seed) => {
    const rnd = seedrandom(seed)

    return (from, to) => {
        return from + ((to - from) * rnd())
    }
}

const createParticles = (size, settings) => {
    const random = createRandom()
    const particles = [...Array(size)].map(() => new Particle(
        new p5.Vector(
            random(0, settings.getOuterWidth()),
            random(0, settings.getOuterHeight())
        ),
        new p5.Vector(0, 0),
        new p5.Vector(0, 0),
        0,
        [settings.getOuterWidth(), settings.getOuterHeight()],
        random(1, 6)
    ))

    // emit as circles
    // const midpoints = [200, 400, 600, 800]
    // const particles = [...Array(size)].map(() => {
    //     const midpoint = midpoints[Math.floor(random(0, 4))] || midpoints[0]
    //     const rnd = random(0, Math.PI * 2)
    //     const position = {
    //         x: Math.sin(rnd) * 200,
    //         y: Math.cos(rnd) * 200
    //     }

    //     return new Particle(
    //         new p5.Vector(
    //             midpoint + position.x,
    //             (settings.getOuterHeight() / 2) + position.y
    //         ),
    //         new p5.Vector(0, 0),
    //         new p5.Vector(0, 0),
    //         0,
    //         [settings.getOuterWidth(), settings.getOuterHeight()],
    //         random(1, 6)
    //     )
    // })

    const forEach = (fn) => particles.forEach(fn)

    const update = (flowfield, t) => {
        const activity = flowfield.energy(t)

        particles.forEach(particle => {
            particle.health = particle.health * 0.7 + (activity > 0.15 ? activity * 4 : 0) * 0.3
            particle.health = Math.min(1.5, particle.health)
        })
    }

    return {
        forEach,
        update,
        length: () => particles.length
    }
}

export default createParticles