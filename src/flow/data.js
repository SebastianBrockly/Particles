import { getDataset } from '../api'

export default async function fetchData(id, settings = { zoom: 6, smoothing: 15 }) {
    const data = await getDataset(id, settings.smoothing, settings.zoom)
    const max = data.reduce(
        (acc, val) => {
            return Math.max(acc, val)
        }, 0
    )

    return {
        data,
        max
    }
}