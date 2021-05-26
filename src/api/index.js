import { getSet, getSets } from './server'

export const getDatasets = () => new Promise((resolve, reject) => {
    getSets()
        .then(data => {
            resolve(data)
        })
})

export const getDataset = (id, detail, zoom) => new Promise((resolve, reject) => {
    getSet(id, zoom, detail)
        .then(data => {
            resolve(data)
        })
})
