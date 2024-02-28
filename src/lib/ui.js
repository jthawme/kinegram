import { writable } from 'svelte/store';

const initial = {
	// Universal loading
	loading: false
};

export const store = writable(initial);

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
 * @param {'setLoading'} action
 * @param {any} [data]
 */
export const dispatch = (action, data) => {
	switch (action) {
		case 'setLoading':
			update('loading', data);
			break;
	}
};
