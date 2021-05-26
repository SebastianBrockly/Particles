// import {
//     getDatasets
// } from '../api'

// // gui
// const gui = async () => {
//     // data select
//     const dataSelect = await (async () => {
//         const select = document.querySelector('.gui__data-select > select')

//         // load options
//         const options = await getDatasets()

//         // add options to select element
//         options.forEach(option => {
//             const optionEl = document.createElement('option')
//             optionEl.value = option
//             optionEl.innerText = option
//             select.appendChild(optionEl)
//         })

//         return select
//     })()

//     const zoomInput = (() => {
//         const input = document.querySelector('.gui__zoom-input > input')
//         input.value = 5

//         return input
//     })()

//     const detailInput = (() => {
//         const input = document.querySelector('.gui__detail-input > input')
//         input.value = 15

//         return input
//     })()

//     const widthInput = (() => {
//         const input = document.querySelector('.gui__width-input > input')
//         input.value = 60

//         return input
//     })()

//     const heightInput = (() => {
//         const input = document.querySelector('.gui__height-input > input')
//         input.value = 40

//         return input
//     })()

//     const innerInput = (() => {
//         const input = document.querySelector('.gui__inner-input > input')
//         input.value = 20

//         return input
//     })()

//     const particlesInput = (() => {
//         const input = document.querySelector('.gui__particles-input > input')
//         input.value = 2000

//         return input
//     })()

//     const distortionInput = (() => {
//         const input = document.querySelector('.gui__distortion-input > input')
//         input.value = 8

//         return input
//     })()

//     const startButton = (() => {
//         const button = document.querySelector('.gui__start-button')
//         return button
//     })()

//     return {
//         listen: (listener) => {
//             dataSelect.addEventListener('change', (e) => {
//                 listener({
//                     file: dataSelect.value,
//                     zoom: zoomInput.value,
//                     detail: detailInput.value,
//                     width: widthInput.value,
//                     height: heightInput.value,
//                     inner: innerInput.value,
//                     particles: particlesInput.value,
//                     distortion: distortionInput.value
//                 }, 'change')
//             })

//             zoomInput.addEventListener('change', () => {
//                 listener({
//                     file: dataSelect.value,
//                     zoom: zoomInput.value,
//                     detail: detailInput.value,
//                     width: widthInput.value,
//                     height: heightInput.value,
//                     inner: innerInput.value,
//                     particles: particlesInput.value,
//                     distortion: distortionInput.value
//                 }, 'change')
//             })

//             detailInput.addEventListener('change', () => {
//                 listener({
//                     file: dataSelect.value,
//                     zoom: zoomInput.value,
//                     detail: detailInput.value,
//                     width: widthInput.value,
//                     height: heightInput.value,
//                     inner: innerInput.value,
//                     particles: particlesInput.value,
//                     distortion: distortionInput.value
//                 }, 'change')
//             })

//             widthInput.addEventListener('change', () => {
//                 listener({
//                     file: dataSelect.value,
//                     zoom: zoomInput.value,
//                     detail: detailInput.value,
//                     width: widthInput.value,
//                     height: heightInput.value,
//                     inner: innerInput.value,
//                     particles: particlesInput.value,
//                     distortion: distortionInput.value
//                 }, 'change')
//             })

//             heightInput.addEventListener('change', () => {
//                 listener({
//                     file: dataSelect.value,
//                     zoom: zoomInput.value,
//                     detail: detailInput.value,
//                     width: widthInput.value,
//                     height: heightInput.value,
//                     inner: innerInput.value,
//                     particles: particlesInput.value,
//                     distortion: distortionInput.value
//                 }, 'change')
//             })

//             innerInput.addEventListener('change', () => {
//                 listener({
//                     file: dataSelect.value,
//                     zoom: zoomInput.value,
//                     detail: detailInput.value,
//                     width: widthInput.value,
//                     height: heightInput.value,
//                     inner: innerInput.value,
//                     particles: particlesInput.value,
//                     distortion: distortionInput.value
//                 }, 'change')
//             })

//             distortionInput.addEventListener('change', () => {
//                 listener({
//                     file: dataSelect.value,
//                     zoom: zoomInput.value,
//                     detail: detailInput.value,
//                     width: widthInput.value,
//                     height: heightInput.value,
//                     inner: innerInput.value,
//                     particles: particlesInput.value,
//                     distortion: distortionInput.value
//                 }, 'change')
//             })

//             startButton.addEventListener('click', () => {
//                 listener({
//                     file: dataSelect.value,
//                     zoom: zoomInput.value,
//                     detail: detailInput.value,
//                     width: widthInput.value,
//                     height: heightInput.value,
//                     inner: innerInput.value,
//                     particles: particlesInput.value,
//                     distortion: distortionInput.value
//                 }, 'start')
//             })
//         },
//         hide: () => {
//             document.querySelector('.gui').style.display = 'none'
//         },
//         show: () => {
//             document.querySelector('.gui').style.display = 'flex'
//         }
//     }
// }

// export default gui

import "./template/styles.css";

const createInput = (o, rootEl, trigger) => {
    const format = (f, v) => {
        return f === "String" ? String(v) : Number(v);
    };

    const label = document.createElement("label");
    label.innerText = o.label;
    label.classList.add("gui-label");

    const children = o.children || [o];
    const inputs = document.createElement("div");
    inputs.classList.add("gui-inputs");
    children.forEach((child) => {
        const input = document.createElement("input");
        input.setAttribute("value", child.value);
        input.setAttribute("id", child.id);
        input.classList.add("gui-input");

        input.addEventListener("change", (e) => {
            trigger("change", child.id, format(child.format, e.target.value));
        });

        trigger("init", child.id, format(child.format, child.value));

        inputs.appendChild(input);
    });

    rootEl.appendChild(label);
    rootEl.appendChild(inputs);

    return [label, inputs];
};

const createSelect = (o, rootEl, trigger) => {
    const label = document.createElement("label");
    label.innerText = o.label;
    label.classList.add("gui-label");

    const select = document.createElement("select");
    select.setAttribute("value", o.value);
    select.setAttribute("id", o.id);
    select.classList.add("gui-select");

    const placeholder = document.createElement("option");
    placeholder.setAttribute("value", -1);
    placeholder.innerText = o.placeholder;
    select.appendChild(placeholder);

    o.options.forEach((option) => {
        const opt = document.createElement("option");
        opt.setAttribute("value", option);
        opt.innerText = option;
        select.appendChild(opt);
    });

    select.addEventListener("change", (e) => {
        trigger("change", o.id, e.target.value);
    });

    trigger("init", o.id, o.value);

    rootEl.appendChild(label);
    rootEl.appendChild(select);

    return [label, select];
};

const createColumn = (rootEl) => {
    const col = document.createElement("div");
    col.classList.add("gui-column");

    rootEl.appendChild(col);

    return col;
};

const createRow = (rootEl) => {
    const row = document.createElement("div");
    row.classList.add("gui-row");

    rootEl.appendChild(row);

    return row;
};

const createDivider = (rootEl) => {
    const div = document.createElement("div");
    div.classList.add("gui-divider");

    rootEl.appendChild(div);

    return div;
};

const createSection = (rootEl, o) => {
    const section = document.createElement("div");
    section.classList.add("gui-collapsible");

    const title = document.createElement("div");
    title.innerText = o.label;
    title.classList.add("gui-collapsible-title");
    title.addEventListener("click", () => {
        section.classList.toggle("gui-collapsible--open");
    });

    const elements = document.createElement("div");
    elements.classList.add("gui-collapsible-items");

    section.appendChild(title);
    section.appendChild(elements);

    rootEl.appendChild(section);

    return elements;
};

const createDescription = (rootEl, o) => {
    const desc = document.createElement("div");
    desc.classList.add("gui-description");

    const label = document.createElement("h1");
    label.classList.add("gui-description-title");

    label.innerText = o.label;
    desc.appendChild(label);

    rootEl.appendChild(desc);
};

const createButton = (rootEl, o, trigger) => {
    const but = document.createElement("div");
    but.classList.add("gui-button");
    but.innerText = o.label;

    but.addEventListener("click", () => {
        trigger("start");
    });

    rootEl.appendChild(but);
};

const createSpace = (rootEl, o) => {
    const sp = document.createElement("div");
    sp.classList.add("gui-space");
    sp.style.height = `${o.height}px`;

    rootEl.appendChild(sp);
};

const createElement = (rootEl, o, trigger) => {
    if (o.type === "input") {
        return createInput(o, rootEl, trigger);
    }

    if (o.type === "column") {
        return createColumn(rootEl);
    }

    if (o.type === "row") {
        return createRow(rootEl);
    }

    if (o.type === "divider") {
        return createDivider(rootEl);
    }

    if (o.type === "select") {
        return createSelect(o, rootEl, trigger);
    }

    if (o.type === "section") {
        return createSection(rootEl, o);
    }

    if (o.type === "description") {
        return createDescription(rootEl, o);
    }

    if (o.type === "button") {
        return createButton(rootEl, o, trigger);
    }

    if (o.type === "space") {
        return createSpace(rootEl, o);
    }
};

const gui = [
    // column 1
    [
        // rows of column 1
        {
            type: "description",
            label: "Flowfield implementation"
        },
        {
            type: "section",
            label: "Meta",
            children: [
                {
                    type: "input",
                    label: "Title",
                    children: [
                        {
                            value: "Particles",
                            id: "title",
                            format: "String"
                        }
                    ]
                }
            ]
        },
        {
            type: "section",
            label: "Data",
            children: [
                {
                    type: "select",
                    placeholder: "Select dataset",
                    value: -1,
                    id: "data",
                    label: "Dataset",
                    options: ["Arbeit_Workout", "Arbeit", "Wanderung"]
                },
                {
                    type: "input",
                    label: "Filter (Zoom, Smooth)",
                    children: [
                        {
                            value: 6,
                            id: "zoom"
                        },
                        {
                            value: 15,
                            id: "smoothing"
                        }
                    ]
                }
            ]
        },
        {
            type: "section",
            label: "Canvas",
            children: [
                {
                    type: "input",
                    label: "Dimensions (width, height)",
                    children: [
                        {
                            value: 1000,
                            id: "canvasWidth"
                        },
                        {
                            value: 1000,
                            id: "canvasHeight"
                        }
                    ]
                }
            ]
        },
        {
            type: "section",
            label: "Flowfield",
            children: [
                {
                    type: "input",
                    label: "Dimensions",
                    children: [
                        {
                            value: 30,
                            id: "flowfieldWidth"
                        },
                        {
                            value: 30,
                            id: "flowfieldHeight"
                        }
                    ]
                },
                {
                    type: "input",
                    label: "Strength",
                    id: "strength",
                    value: 0.5
                },
                {
                    type: "input",
                    label: "Neighbours",
                    id: "neighbours",
                    value: 2
                }
            ]
        },
        {
            type: "section",
            label: "System",
            children: [
                {
                    type: "input",
                    label: "Time increment",
                    children: [
                        {
                            value: 0.02,
                            id: "step"
                        }
                    ]
                }
            ]
        },
        {
            type: "section",
            label: "Particle",
            children: [
                {
                    type: "input",
                    label: "Health mod",
                    children: [
                        {
                            value: 0.5,
                            id: "modHealth"
                        }
                    ]
                },
                {
                    type: "input",
                    label: "Health max",
                    children: [
                        {
                            value: 25.0,
                            id: "maxHealthRange"
                        }
                    ]
                }
            ]
        },
        {
            type: "section",
            label: "Emitter",
            children: [
                {
                    type: "input",
                    label: "Number of particles",
                    children: [
                        {
                            value: 7000,
                            id: "num_particles"
                        }
                    ]
                },
                {
                    type: "input",
                    label: "Max mass of particles",
                    children: [
                        {
                            value: 5,
                            id: "maxMass"
                        }
                    ]
                }
            ]
        },
        {
            type: "space",
            height: 400
        },
        {
            type: "button",
            label: "Run"
        }
    ]
];

const initGui = (root) => {
    // listeners
    const listeners = [];
    const state = {};
    const trigger = (eventType, key, value) => {
        state[key] = value;
        listeners
            .filter(({ event }) => event === eventType)
            .forEach((listener) => {
                listener.cb(state);
            });
    };

    const el = document.createElement("div");
    el.classList.add("gui");

    gui.forEach((column) => {
        const col = createElement(el, {
            type: "column"
        });

        column.forEach((row) => {
            const rowEl = createElement(col, {
                type: "row"
            });

            if (row.type === "section") {
                const sec = createSection(rowEl, row);
                row.children.forEach((element) => {
                    createElement(sec, element, trigger);
                });
            } else {
                createElement(rowEl, row, trigger);
            }
        });
    });

    root.appendChild(el);

    return {
        addEventListener: (event, cb) => {
            listeners.push({
                event,
                cb
            });
        }
    };
};

export default initGui