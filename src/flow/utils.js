// helpers
export const blend = n => {
    const w = n - Math.floor(n)
    return [
        [1 - w, Math.floor(n)],
        [w, Math.floor(n) + 1]
    ]
}

export const average = arr => arr.reduce(
    (sum, val) => sum += val, 0
) / arr.length