/** @type {import('svelte/action').Action<HTMLElement, (dimensions: {width: number, height: number}) => void>}  */
export function resize(node, cb) {
	let _cb = cb;

	/** @type {ResizeObserverCallback} */
	function onResize(entries) {
		cb({
			width: entries[0].contentRect.width,
			height: entries[0].contentRect.height
		});
	}

	const ro = new ResizeObserver(onResize);

	ro.observe(node);

	const { width, height } = node.getBoundingClientRect();

	cb({
		width,
		height
	});

	return {
		update(cb) {
			_cb = cb;
		},

		destroy() {
			ro.disconnect();
		}
	};
}
