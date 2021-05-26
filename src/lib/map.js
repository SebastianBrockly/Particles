const map = (v, min0, max0, min1, max1) => {
    return (v - min0) * (max1 - min1) / (max0 - min0) + min1
}

export default map