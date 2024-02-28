export const load = async () => {
	const KinegramWorker = await import('$lib/engine/Kinegram.worker.js?worker').then(
		(mod) => mod.default
	);
	const worker = new KinegramWorker();

	return {
		/**
		 *
		 * @param {Blob[]} frames
		 * @param {string} type
		 * @param {number} barWidth
		 * @param {number} width
		 * @param {number} height
		 * @param {{retainColour: boolean, colour: string, threshold: number}} options
		 */
		async createComposite(frames, type, barWidth, width, height, options) {
			const canvas = new OffscreenCanvas(width, height);
			const frameBitmaps = await Promise.all(frames.map((blob) => createImageBitmap(blob)));

			worker.postMessage(
				{
					canvas,
					action: 'createComposite',
					frames: frameBitmaps,
					args: [type, barWidth, width, height, options]
				},
				[...frameBitmaps, canvas]
			);

			return canvas;
		}
	};
};
