import { derived, get, writable } from 'svelte/store';

/** @type {Blob[]} */
const initial = [];

const frames = writable(initial);

export const store = derived([frames], ([$frames]) => {
	return {
		frames: $frames,
		total: $frames.length
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
 * @param {'add' | 'remove' | 'replace'} action
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
	}
};
