import { page } from '$app/stores';
import { get } from 'svelte/store';

/**
 * A performant version of a function call, used to keep functions
 * running at 60fps
 *
 * @param {function} cb
 * @returns {function}
 */
export const tickUpdate = (cb) => {
	let ticking = false;

	const update = (e) => {
		cb(e);
		ticking = false;
	};

	const requestTick = (e) => {
		if (!ticking) {
			requestAnimationFrame(() => update(e));
			ticking = true;
		}
	};

	return requestTick;
};

/**
 * Clamps a number
 *
 * @param {number} num
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (num, min, max) => {
	return Math.min(Math.max(num, min), max);
};

/**
 * Maps a number from 1 range to another. I cannot believe
 * how much I've used this function in my lifetime
 *
 * @param {number} value
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export const mapRange = (value, x1, y1, x2, y2) => ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

/**
 * A simple linear interpolation function
 *
 * @param {number} v0 Lower value
 * @param {number} v1 Target Value
 * @param {*} t
 * @returns
 */
export const lerp = (v0, v1, t) => {
	return v0 * (1 - t) + v1 * t;
};

/**
 * A promise version of setTimeout
 *
 * @param {number} time
 * @param {boolean} error
 * @returns {Promise<void>}
 */
export const timer = (time = 2000, error = false) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (error) {
				reject();
			} else {
				resolve();
			}
		}, time);
	});
};

/**
 * Serialised object of form elements
 *
 * @param {HTMLFormElement} form
 * @returns {object}
 */
export const formToObject = (form) => {
	const fd = new FormData(form);
	return [...fd.entries()].reduce(
		(prev, curr) => ({
			...prev,
			[curr[0]]: curr[1]
		}),
		{}
	);
};

/**
 * Convenience function that registers the 2 window events needed
 * to listen for window resizes
 *
 * @param {EventListenerOrEventListenerObject} cb
 * @returns {function} Unlisten
 */
export const onWindowResize = (cb) => {
	window.addEventListener('resize', cb, {
		passive: true
	});

	window.addEventListener('orientationchange', cb, {
		passive: true
	});

	return () => {
		window.removeEventListener('resize', cb);
		window.removeEventListener('orientationchange', cb);
	};
};

/**
 * Returns a debounced version of the function, so that it runs
 * only after X seconds of not being called
 *
 * @param {function} cb
 * @param {number} time
 * @returns {function}
 */
export const debounce = (cb, time = 1000) => {
	let timer = 0;

	return function () {
		clearTimeout(timer);
		timer = window.setTimeout(() => {
			cb(...arguments);
		}, time);
	};
};

/**
 * Returns a throttled version of the function, so that it runs only
 * a maximum of X seconds
 *
 * @param {function} cb
 * @param {number} time
 * @returns {function}
 */
export const throttle = (cb, time = 1000) => {
	/** @type {number|null} */
	let timer;

	return function () {
		if (timer) {
			return;
		}

		timer = window.setTimeout(() => {
			cb(...arguments);
			timer = null;
		}, time);
	};
};

/**
 * A promise to load an image element
 *
 * @param {string} src
 * @returns {Promise<HTMLImageElement>}
 */
export const loadImageElement = (src) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject();
		img.src = src;
	});
};

/**
 * A promise to load an image as a blob url
 *
 * @param {string} src
 * @param {function} onSignal A callback to get an abort signal
 * @returns {Promise<string>}
 */
export const loadImage = (src, onSignal = () => false) => {
	const controller = new AbortController();
	const { signal } = controller;

	onSignal(controller);

	return fetch(src, { signal })
		.then((resp) => resp.blob())
		.then((blob) => URL.createObjectURL(blob));
};

/**
 * A function to register a change listener on a media query
 *
 * @param {string} query
 * @param {function} cb
 * @returns {function} Unlisten
 */
export const breakpointListen = (query, cb) => {
	const mq = window.matchMedia(query);

	/**
	 * @param {MediaQueryListEvent} ev
	 */
	const onCall = (ev) => {
		cb(ev.matches);
	};
	mq.addListener(onCall);

	cb(mq.matches);

	return () => mq.removeListener(onCall);
};

/**
 * Adds an event listener and returns a cb to unlisten
 *
 * @param {HTMLElement | Window | Document} el
 * @param {string} evt
 * @param {EventListenerOrEventListenerObject} cb
 * @param {object | boolean} opts
 * @returns {() => void} Unlisten
 */
export const listenCb = (el, evt, cb, opts = false) => {
	el.addEventListener(evt, cb, opts);
	return () => el.removeEventListener(evt, cb);
};

/**
 * Get random number between 2 numbers
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const randomBetween = (min, max) => {
	return Math.random() * (max - min) + min;
};

/**
 * Randomises array
 *
 * @param {any[]} array
 * @returns {any[]}
 */
export const shuffle = (array) => {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}

	return array;
};

const LOCAL_STORAGE_PREFIX = 'jt';

/**
 * Convenience feature for grabbing a value from the local storage
 * with a default fallback if not present
 *
 * @param {string} key
 * @param {any} defaultValue
 * @param {function} transform
 * @returns {string|any}
 */
export const getPersistedValue = (key, defaultValue, transform = (val) => val) => {
	const item = localStorage.getItem([LOCAL_STORAGE_PREFIX, key].join('-'));

	return item ? transform(item) : defaultValue;
};

/**
 * Saves a value to local storage
 *
 * @param {string} key
 * @param {string} value
 */
export const persistValue = (key, value) => {
	localStorage.setItem([LOCAL_STORAGE_PREFIX, key].join('-'), value);
};

/**
 * Convenience function to remove item with global prefix
 *
 * @param {string} key
 */
export const removePersistedValue = (key) => {
	localStorage.removeItem([LOCAL_STORAGE_PREFIX, key].join('-'));
};

/**
 * A promisified version of a requestAnimationFrame as a utility
 *
 * @returns {Promise<void>}
 */
export const singleRaf = () => {
	return new Promise((resolve) => {
		requestAnimationFrame(() => {
			resolve();
		});
	});
};

/**
 * A double version of the requestAnimationFrame promise
 *
 * @returns {Promise<void>}
 */
export const doubleRaf = async () => {
	await singleRaf();
	return singleRaf();
};

const KEYS = {
	ESCAPE: 27
};

/**
 * A function that registers a key listener for escaping
 *
 * @param {function} onEscape
 * @returns {function} Unlisten
 */
export const registerExits = (onEscape) => {
	const cb = (e) => {
		if ([KEYS.ESCAPE].includes(e.keyCode)) {
			onEscape();
		}
	};

	return listenCb(document, 'keyup', cb);
};

/**
 * A function for adding a listener to determine if an interaction was made outside
 * an element of its descendents
 *
 * @param {HTMLElement} el
 * @param {function} onClickOutside
 * @param {function} [validator]
 * @returns {function} Unlisten
 */
export const clickOutside = (
	el,
	onClickOutside,
	validator // (el: HTMLElement, e: MouseEvent) => boolean
) => {
	const cb = (e) => {
		if (validator) {
			if (validator(el, e)) {
				onClickOutside();
			}
		} else if (e.target && e.target !== el && !el.contains(e.target)) {
			onClickOutside();
		}
	};

	const unlisten = listenCb(document, 'click', cb);
	const unregisterExits = registerExits(onClickOutside);

	return () => {
		unregisterExits();
		unlisten();
	};
};

export const readableTime = (seconds) => {
	return new Date(seconds * 1000).toISOString().slice(11, -1);
};

export const nearestX = (seconds, nearest = 5, method = 'round') => {
	switch (method) {
		case 'floor':
			return Math.floor(seconds / nearest) * nearest;
		case 'ceil':
			return Math.floor(seconds / nearest) * nearest;
		default:
			return Math.round(seconds / nearest) * nearest;
	}
};

export const slugify = (str) => {
	str = str.replace(/^\s+|\s+$/g, ''); // trim
	str = str.toLowerCase();

	// remove accents, swap ñ for n, etc
	var from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;';
	var to = 'aaaaeeeeiiiioooouuuunc------';
	for (var i = 0, l = from.length; i < l; i++) {
		str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
	}

	str = str
		.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
		.replace(/\s+/g, '-') // collapse whitespace and replace by -
		.replace(/-+/g, '-'); // collapse dashes

	return str;
};

/**
 *
 * @param {any[]} arr
 * @returns {any}
 */
export const randomFrom = (arr) => {
	return arr[Math.floor(arr.length * Math.random())];
};

/**
 *
 * @param {any[]} arr
 * @param {number} idx
 * @param {number} [total]
 * @returns {any}
 */
export const getNth = (arr, idx, total) => {
	return arr[idx % (total || arr.length)];
};

/**
 *
 * @param {string} slug
 * @returns {boolean}
 */
export const isActive = (slug) => get(page).url.pathname === slug;
