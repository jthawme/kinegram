import { writable } from 'svelte/store';

const defaultData = {
	foo: 'bar'
};
const data = writable();

export const store = {
	...data,

	/**
	 *
	 * @param {keyof defaultData} key
	 * @param {any} value
	 * @returns {Promise<void>}
	 */
	update(key, value) {
		return new Promise((resolve) => {
			data.update((state) => ({
				...state,
				[key]: value
			}));
			resolve();
		});
	}
};
