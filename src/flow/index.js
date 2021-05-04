
import './template/styles.css'

import fetchData from './data'
import createParticleSystem from './system'
import initGui from './gui'

const settings = [
    {
        width: 100,
        height: 100,
        inner: 20,
        getOuterWidth: () => 100 * 20,
        getOuterHeight: () => 100 * 20,
        particles: 10000,
        loops: 2,
        distortion: 14,
        timestep: 0.001,
        color: 'b/w'
    }
]

const flow = async () => {
    const gui = await initGui()

    const state = (() => {
        let _data = null
        let _max = null

        const listeners = []

        gui.listen((state, event) => {
            if (event === 'start') {
                fetchData(state.file, {
                    zoom: state.zoom,
                    smoothing: state.detail
                })
                    .then(({ data, max }) => {
                        _data = data
                        _max = max

                        listeners && listeners[0]({
                            data: _data || [],
                            max: _max || 0,
                        }, state)
                    })
            }
        })

        return {
            listen: listener => {
                listeners.push(listener)
            }
        }
    })()

    state.listen(async (dataset, guiState) => {
        gui.hide()
        for (let i = 0; i < settings.length; i++) {
            const { width, height, inner, particles, loops, distortion } = settings[i]
            await createParticleSystem(dataset, {
                ...settings[i],
                ...guiState,
                width: Number(guiState.width),
                height: Number(guiState.height),
                inner: Number(guiState.inner),
                getOuterWidth: () => Number(guiState.width) * Number(guiState.inner),
                getOuterHeight: () => Number(guiState.height) * Number(guiState.inner),
                particles: Number(guiState.particles),
                distortion: Number(guiState.distortion)
            })
        }
        gui.show()
    })
}

flow()