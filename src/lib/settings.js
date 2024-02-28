import { derived, get, writable } from 'svelte/store';
import { ASPECT, BAR_WIDTH, SPEED, TYPE } from './constants.js';

const initial = {
	// Whether to show the advanced menu or not
	showAdvanced: false,

	// Whether or not to retain the colour of the image
	retainColour: false,

	// The colour to use on the threshold
	colour: '#333538',

	// The width of the bars
	width: BAR_WIDTH.STANDARD,

	// The speed of the preview
	speed: SPEED.STANDARD,

	// Whether or not to step through the frames or to slide through them
	smooth: false,

	// The angle of the overlaid bars in the preview
	angle: 0,

	aspect: ASPECT.PAPER,

	type: TYPE.REGULAR,

	asZip: false,

	asSvg: false,

	// The threshold level for the brightness on each pixel
	threshold: 0.5
};

export const store = writable(initial);

export const type = derived([store], ([$store]) => $store.type);
export const retainColour = derived([store], ([$store]) => $store.retainColour);
export const colour = derived([store], ([$store]) => $store.colour);
export const threshold = derived([store], ([$store]) => $store.threshold);

/**
 *
 * @param {keyof initial} key
 * @param {any} value
 */
const update = (key, value) => {
	store.update((state) => ({
		...state,
		[key]: value
	}));
};

/**
 *
 * @param {'toggleAdvanced' | 'setAdvanced' | 'setRetainColour' | 'setColour' | 'setWidth' | 'setSpeed' | 'setSmooth' | 'setAngle' | 'setAspect' | 'setType' | 'setAsZip' | 'setAsSvg' | 'setThreshold' | 'reset' } action
 * @param {any} [data]
 */
export const dispatch = (action, data) => {
	const state = get(store);

	switch (action) {
		case 'toggleAdvanced':
			update('showAdvanced', !state.showAdvanced);
			break;
		case 'setAdvanced':
			update('showAdvanced', data);
			break;
		case 'setRetainColour':
			update('retainColour', data);
			break;
		case 'setColour':
			update('colour', data);
			break;
		case 'setWidth':
			update('width', data);
			break;
		case 'setSpeed':
			update('speed', data);
			break;
		case 'setSmooth':
			update('smooth', data);
			break;
		case 'setAngle':
			update('angle', data);
			break;
		case 'setAspect':
			update('aspect', data);
			break;
		case 'setType':
			update('type', data);
			break;
		case 'setAsZip':
			update('asZip', data);
			break;
		case 'setAsSvg':
			update('asSvg', data);
			break;
		case 'setThreshold':
			update('threshold', data);
			break;
		case 'reset':
			store.update(() => ({ ...initial }));
			break;
	}
};
