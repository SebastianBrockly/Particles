const maxSpeed = 4.0
const maxForce = 0.5

class Particle {
    constructor(position, velocity, acceleration, health, boundaries, mass) {
        this.position = position
        this.velocity = velocity
        this.acceleration = acceleration
        this.mass = mass
        this.boundaries = boundaries
        this.health = health

        this.prevPosition = this.position.copy()
    }

    isAlive = () => {
        return this.health > 0
    }

    applyForce = (force) => {
        this.acceleration.add(force).div(this.mass).limit(maxForce)
        // this.acceleration.add(force.limit(maxForce))
    }

    applyEnergy = (energy) => {
        this.health += energy
        this.health = Math.max(energy, 2)
    }

    bounds = () => {
        if (this.position.x >= this.boundaries[0]) {
            this.position.x = 0
            this.prevPosition.x = 0
        }
        if (this.position.x < 0) {
            this.position.x = this.boundaries[0] - 1
            this.prevPosition.x = this.boundaries[0] - 1
        }
        if (this.position.y >= this.boundaries[1]) {
            this.position.y = 0
            this.prevPosition.y = 0
        }
        if (this.position.y < 0) {
            this.position.y = this.boundaries[1] - 1
            this.prevPosition.y = this.boundaries[1] - 1
        }
    }

    updatePrev = () => {
        this.prevPosition.x = this.position.x
        this.prevPosition.y = this.position.y
    }

    update = () => {
        this.velocity.add(this.acceleration).limit(maxSpeed)
        this.position.add(this.velocity)

        this.acceleration.limit(0)
        this.bounds()
        // this.health -= 0.01
    }
}

export default Particle