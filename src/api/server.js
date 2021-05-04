import axios from 'axios'

const cache = {}

const sum = (arr) => arr.reduce(
    (acc, val) => {
        acc += val
        return acc
    }, 0
)

const round = (number, decimals) => {
    return Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
}

const movingAverage = (arr, size) => {
    return arr.map((v, i) => {
        const samples = arr.slice(Math.max(0, i - size), i)
        return sum(samples) / samples.length
    }).slice(1)
}

const transform = (json, zoom = 1, detail = 1) => {
    // nur die Länge des Vektors
    const lengths = json.map(sample => {
        return Math.sqrt(sample[0] * sample[0] + sample[1] * sample[1] + sample[2] * sample[2])
    })

    // fasse 2 ^ zoom samples als ein sample zusammen
    const samplesSize = Math.pow(2, zoom)

    return movingAverage(lengths.reduce(
        (acc, val, index) => {
            if (index % samplesSize === 0 && index > 0) {
                acc.samples.push(acc.current / samplesSize)
                acc.current = 0
            } else {
                acc.current += val
            }
            return acc
        }, {
        samples: [],
        current: 0
    }
    ).samples, detail).map(v => round(v, 4))
}

export const getSets = () => {
    return axios.get('./assets/data/overview.json').then(response => {
        return response.data.map(file => file.replace('.json', ''))
    })
}

export const getSet = async (id, zoom, detail) => {
    return new Promise((resolve, reject) => {
        const cacheKey = JSON.stringify([
            id, zoom, detail
        ])

        if (cache[cacheKey]) {
            return resolve(cache[cacheKey])
        }

        axios.get(`./assets/data/sets/${id}.json`).then(response => {
            cache[cacheKey] = transform(response.data, zoom, detail)
            return resolve(cache[cacheKey])
        })
    })
}