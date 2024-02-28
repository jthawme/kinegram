import { writable } from 'svelte/store';
import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId();

/** @type {Array<{ id: string, message: string, type: string, delay?: number, action?: () => void }>} */
const initial = [];
const toasts = writable(initial);

export const ToastManager = {
	...toasts,

	/**
	 *
	 * @param {string} message
	 * @param {{ type?: string, delay?: number, action?: () => void }} options
	 * @returns {() => void}
	 */
	add(message, { type = 'normal', delay, action } = {}) {
		const id = uid.rnd();

		toasts.update((state) => [
			...state,
			{
				id,
				message,
				type,
				delay,
				action
			}
		]);

		return () => ToastManager.remove(id);
	},

	/**
	 *
	 * @param {string} id
	 */
	remove(id) {
		toasts.update((state) => {
			const arr = state.slice();

			arr.splice(
				arr.findIndex((item) => item.id === id),
				1
			);

			return arr;
		});
	}
};
