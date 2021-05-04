import {
    getDatasets
} from '../api'

// gui
const gui = async () => {
    // data select
    const dataSelect = await (async () => {
        const select = document.querySelector('.gui__data-select > select')

        // load options
        const options = await getDatasets()

        // add options to select element
        options.forEach(option => {
            const optionEl = document.createElement('option')
            optionEl.value = option
            optionEl.innerText = option
            select.appendChild(optionEl)
        })

        return select
    })()

    const zoomInput = (() => {
        const input = document.querySelector('.gui__zoom-input > input')
        input.value = 6

        return input
    })()

    const detailInput = (() => {
        const input = document.querySelector('.gui__detail-input > input')
        input.value = 15

        return input
    })()

    const widthInput = (() => {
        const input = document.querySelector('.gui__width-input > input')
        input.value = 60

        return input
    })()

    const heightInput = (() => {
        const input = document.querySelector('.gui__height-input > input')
        input.value = 40

        return input
    })()

    const innerInput = (() => {
        const input = document.querySelector('.gui__inner-input > input')
        input.value = 20

        return input
    })()

    const particlesInput = (() => {
        const input = document.querySelector('.gui__particles-input > input')
        input.value = 2000

        return input
    })()

    const distortionInput = (() => {
        const input = document.querySelector('.gui__distortion-input > input')
        input.value = 8

        return input
    })()

    const startButton = (() => {
        const button = document.querySelector('.gui__start-button')
        return button
    })()

    return {
        listen: (listener) => {
            dataSelect.addEventListener('change', (e) => {
                listener({
                    file: dataSelect.value,
                    zoom: zoomInput.value,
                    detail: detailInput.value,
                    width: widthInput.value,
                    height: heightInput.value,
                    inner: innerInput.value,
                    particles: particlesInput.value,
                    distortion: distortionInput.value
                }, 'change')
            })

            zoomInput.addEventListener('change', () => {
                listener({
                    file: dataSelect.value,
                    zoom: zoomInput.value,
                    detail: detailInput.value,
                    width: widthInput.value,
                    height: heightInput.value,
                    inner: innerInput.value,
                    particles: particlesInput.value,
                    distortion: distortionInput.value
                }, 'change')
            })

            detailInput.addEventListener('change', () => {
                listener({
                    file: dataSelect.value,
                    zoom: zoomInput.value,
                    detail: detailInput.value,
                    width: widthInput.value,
                    height: heightInput.value,
                    inner: innerInput.value,
                    particles: particlesInput.value,
                    distortion: distortionInput.value
                }, 'change')
            })

            widthInput.addEventListener('change', () => {
                listener({
                    file: dataSelect.value,
                    zoom: zoomInput.value,
                    detail: detailInput.value,
                    width: widthInput.value,
                    height: heightInput.value,
                    inner: innerInput.value,
                    particles: particlesInput.value,
                    distortion: distortionInput.value
                }, 'change')
            })

            heightInput.addEventListener('change', () => {
                listener({
                    file: dataSelect.value,
                    zoom: zoomInput.value,
                    detail: detailInput.value,
                    width: widthInput.value,
                    height: heightInput.value,
                    inner: innerInput.value,
                    particles: particlesInput.value,
                    distortion: distortionInput.value
                }, 'change')
            })

            innerInput.addEventListener('change', () => {
                listener({
                    file: dataSelect.value,
                    zoom: zoomInput.value,
                    detail: detailInput.value,
                    width: widthInput.value,
                    height: heightInput.value,
                    inner: innerInput.value,
                    particles: particlesInput.value,
                    distortion: distortionInput.value
                }, 'change')
            })

            distortionInput.addEventListener('change', () => {
                listener({
                    file: dataSelect.value,
                    zoom: zoomInput.value,
                    detail: detailInput.value,
                    width: widthInput.value,
                    height: heightInput.value,
                    inner: innerInput.value,
                    particles: particlesInput.value,
                    distortion: distortionInput.value
                }, 'change')
            })

            startButton.addEventListener('click', () => {
                listener({
                    file: dataSelect.value,
                    zoom: zoomInput.value,
                    detail: detailInput.value,
                    width: widthInput.value,
                    height: heightInput.value,
                    inner: innerInput.value,
                    particles: particlesInput.value,
                    distortion: distortionInput.value
                }, 'start')
            })
        },
        hide: () => {
            document.querySelector('.gui').style.display = 'none'
        },
        show: () => {
            document.querySelector('.gui').style.display = 'flex'
        }
    }
}

export default gui