import axios from 'axios'
import { getSet, getSets } from './server'

const localhost = '192.168.0.27'

// export const getDatasets = () => new Promise((resolve, reject) => {
//     axios.get(`http://${localhost}:4444/data/list`)
//         .then(response => {
//             resolve(response.data && response.data.files)
//         })
// })

export const getDatasets = () => new Promise((resolve, reject) => {
    getSets()
        .then(data => {
            resolve(data)
        })
})

export const getDataset = (id, detail, zoom) => new Promise((resolve, reject) => {
    // axios.get(`http://${localhost}:4444/data/${id}?zoom=${zoom}&detail=${detail}`)
    //     .then(response => {
    //         resolve(response.data)
    //     })
    getSet(id, zoom, detail)
        .then(data => {
            resolve(data)
        })
})

export const getRawDataset = (id) => new Promise((resolve, reject) => {
    axios.get(`http://${localhost}:4444/data/raw/${id}`)
        .then(response => {
            resolve(response.data)
        })
})
