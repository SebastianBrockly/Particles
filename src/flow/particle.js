let maxSpeed = 4.0
let maxForce = 0.5
let modHealth = 0.5
class Particle {
    static setGlobalSettings = settings => {
        maxSpeed = settings.maxSpeed || maxSpeed
        maxForce = settings.maxForce || maxForce
        modHealth = settings.modHealth || modHealth
    }

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

    getMaxForce = () => {
        return maxForce + (Math.random() * 0.2 - 0.1)
    }

    getMaxSpeed = () => {
        return maxSpeed - (Math.random() * 2 - 1)
    }

    applyForce = (force) => {
        this.acceleration.add(force).div(this.mass).limit(maxForce)
    }

    applyEnergy = (energy) => {
        this.health = this.health * modHealth + energy * (1 - modHealth)
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
    }
}

export default Particle