import { derived, get, writable } from 'svelte/store';
import { DEFAULT_MAX_FRAMES } from './constants';

/** @type {Blob[]} */
const initial = [];

const maxFrames = writable(DEFAULT_MAX_FRAMES);
const frames = writable(initial);

export const store = derived([frames, maxFrames], ([$frames, $maxFrames]) => {
	return {
		frames: $frames,
		total: $frames.length,
		maxFrames: $maxFrames
	};
});

/**
 *
 * @param {Blob} value
 */
const push = (value) => {
	frames.update((a) => {
		const arr = a.slice();

		return [...arr, value];
	});
};

/**
 *
 * @param {number} idx
 * @param {Blob} value
 */
const replace = (idx, value) => {
	frames.update((a) => {
		const arr = a.slice();

		arr.splice(idx, 1, value);

		return arr;
	});
};

const remove = (idx) => {
	frames.update((a) => {
		const arr = a.slice();

		arr.splice(idx, 1);

		return arr;
	});
};

/**
 *
 * @param {number} number
 */
const alterMaxFrames = (number) => {
	maxFrames.update(() => {
		return number;
	});
};

/**
 *
 * @param {'add' | 'remove' | 'replace' | 'alter'} action
 * @param {any} [data]
 */
export const dispatch = (action, data) => {
	const state = get(store);

	switch (action) {
		case 'add':
			push(data);
			break;
		case 'remove':
			remove(data);
			break;
		case 'replace':
			replace(data.index, data.value);
			break;
		case 'alter':
			alterMaxFrames(data);
			break;
	}
};
