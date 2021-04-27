import { getDataset } from '../api'

export default async function fetchData() {
    const dataSettings = {
        zoom: 6,
        smoothing: 15
    }
    const data = await getDataset('dataset_home', dataSettings.smoothing, dataSettings.zoom)
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