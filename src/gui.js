import {compositions, layerOptions, options, palettes} from "./config";
import * as core from "fxhash_lib/core";
import * as dev from "fxhash_lib/dev";
import {layers, debug, vars} from "./vars";

export const createGUI = (gui) => {
    gui.remember(options);
    const onChange = () => {
        debug.visible = options.showDebug;
        if (options.hasOwnProperty('snapOverlay')) {
            vars.snapOverlay.mesh.visible = options.snapOverlay;
        }
        if (options.hasOwnProperty('snapBlending')) {
            vars.snapOverlay.mesh.material.blending = options.snapBlending;
        }
        if (options.hasOwnProperty('snapOpacity')) {
            vars.snapOverlay.mesh.material.opacity = options.snapOpacity;
        }
    }

    const folder = gui.addFolder('Options');
    folder.add(options, 'minLayers', 1, 5, 1);
    folder.add(options, 'maxLayers', 1, 5, 1);
    if (options.hasOwnProperty('opacity')) {
        folder.add(options, 'opacity', 0, 1, 0.01);
    }
    folder.add(options, 'minStrokes', 1, 22, 1);
    folder.add(options, 'maxStrokes', 1, 22, 1);
    folder.add(options, 'strokesRel', ['same', 'mirror', 'mirrorX', 'mirrorY', 'mirrorRand', 'random']);
    folder.add(options, 'minSpeed', 0.001, 0.01, 0.001).listen();
    folder.add(options, 'maxSpeed', 0.01, 0.1, 0.001).listen();
    if (options.hasOwnProperty('speedMult')) {
        folder.add(options, 'speedMult', 0.1, 10, 0.1).listen();
    }
    if (options.hasOwnProperty('maxIterations')) {
        folder.add(options, 'maxIterations', 1, 20, 1);
    }
    if (options.hasOwnProperty('onClick')) {
        folder.add(options, 'onClick', ['', 'regenerate', 'reset', 'addnew']);
    }
    if (options.hasOwnProperty('maxChanges')) {
        folder.add(options, 'maxChanges', 0, 20, 1);
    }
    if (options.hasOwnProperty('snapBlending')) {
        folder.add(options, 'snapBlending', 1, 5, 1).onChange(onChange);
    }
    if (options.hasOwnProperty('snapOpacity')) {
        folder.add(options, 'snapOpacity', 0, 1.0, 0.01).onChange(onChange);
    }
    if (options.hasOwnProperty('snapOverlay')) {
        folder.add(options, 'snapOverlay').onChange(onChange);
    }
    if (options.hasOwnProperty('showDebug')) {
        folder.add(options, 'showDebug').onChange(onChange);
    }

    dev.createCheckBoxGui(compositions, 'Compositions');
    dev.createCheckBoxGui(palettes, 'Palettes');
}

export const createLayerGUI = (gui, i, randomize) => {
    const folder = gui.addFolder('Layer '+i);
    const updateLayer = () => {
        layers[i].mesh.visible = layerOptions[i].visible;
        layers[i].setOptions(layerOptions[i]);
        resetLayers();
        core.uFrame.value = 0;
    }
    const resetLayers = () => {
        for (let i=0; i<layers.length; i++) {
            layers[i].reset();
        }
    }
    const methods = {
        randomize: function() {
            randomize(layers[i], true);
        }
    };
    folder.add(layerOptions[i], 'visible', 0, 5, 1).listen().onChange(updateLayer);
    folder.add(layerOptions[i], 'blendModePass', 0, 5, 1).listen().onChange(updateLayer);
    folder.add(layerOptions[i], 'blendModeView', 0, 5, 1).listen().onChange(updateLayer);
    folder.add(layerOptions[i], 'zoom', 0.1, 20, 0.1).listen().onChange(updateLayer);
    folder.add(layerOptions[i], 'dt', 0.1, 0.3, 0.01).listen().onChange(updateLayer);
    folder.add(layerOptions[i], 'K', 0, 1, 0.01).listen().onChange(updateLayer);
    folder.add(layerOptions[i], 'nu', 0, 1, 0.01).listen().onChange(updateLayer);
    folder.add(layerOptions[i], 'kappa', 0, 1, 0.01).listen().onChange(updateLayer);
    folder.add(methods, 'randomize');
}