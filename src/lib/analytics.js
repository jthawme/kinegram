/**
 *
 * @param {string} eventName
 * @param {any} eventData
 */
export const pl = (eventName, eventData = {}) => {
	try {
		window.plausible(eventName, eventData);
	} catch {
		//
	}
};
