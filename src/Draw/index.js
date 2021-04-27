import * as p5 from 'p5'

class Image {
    constructor(width, height) {
        this.width = width
        this.height = height
        this.pixels = this.initPixels()
    }

    initPixels = () => {
        this.pixels = []
        for (let x = 0; x < this.width; x += 1) {
            if (!this.pixels[x]) {
                this.pixels[x] = []
            }
            for (let y = 0; y < this.height; y += 1) {
                this.pixels[x][y] = 0
            }
        }
        return this.pixels
    }

    set = (x, y, v) => {
        this.pixels[x][y] = v
    }

    increment = (x, y) => {
        this.pixels[x][y] += 1
    }
}

class Sketch {
    constructor() {
        this.running = true
        this.p5sketch = new p5(sketch => {
            this.map = sketch.map
        })
    }

    createCanvas = (width, height) => {
        this.image = new Image(width, height)
    }
    
    point = (x, y) => {
        this.image.increment(Math.floor(x), Math.floor(y))
    }

    random = (start, end) => {
        return start + Math.random() * (end - start)
    }

    circle = (x, y) => {
        this.point(x, y)
    }

    noStroke = () => {}

    background = () => {}

    fill = () => {}

    push = () => {}

    pop = () => {}

    rect = () => {}

    text = () => {}

    millis = () => {}

    noLoop = () => {
        this.running = false
    }
}

export class Loop {
    constructor(fn) {
        this.fn = fn
        this.sketch = new Sketch()
        this.fn(this.sketch)
        this.isInit = false
        this.stopped = false
        this.c = 0
        this.loop()
    }

    loop = () => {
        if (!this.isInit) {
            this.sketch.setup()
            this.isInit = true
        }

        this.sketch.draw()
        
        if (this.sketch.running) {
            requestAnimationFrame(this.loop)
        }
    }
}

export default Image