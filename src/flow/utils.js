// helpers
export const blend = n => {
    const w = n - Math.floor(n)
    return [
        [1 - w, Math.floor(n)],
        [w, Math.floor(n) + 1]
    ]
}

