
import './template/styles.css'

import fetchData from './data'
import createParticleSystem from './system'
import initGui from './gui'

const flow = async () => {
    const { addEventListener: addGuiListener } = initGui(
        document.getElementById("app")
    );

    addGuiListener("start", async (state) => {
        const dataset = await fetchData(state.data, {
            zoom: state.zoom,
            smoothing: state.smoothing
        })

        const response = await createParticleSystem(dataset, {
            ...state,
            width: Number(state.flowfieldWidth),
            height: Number(state.flowfieldHeight),
            flowfieldWidth: Number(state.flowfieldWidth),
            flowfieldHeight: Number(state.flowfieldHeight),
            getOuterWidth: () => state.canvasWidth,
            getOuterHeight: () => state.canvasHeight,
            particles: Number(state.num_particles),
            distortion: Number(state.strength),
            step: Number(state.step),
            modHealth: Number(state.modHealth)
        })
    });
}

flow()