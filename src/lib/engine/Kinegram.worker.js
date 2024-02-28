import { createComposite } from '$lib/engine/Kinegram.js';

self.onmessage = async ({ data }) => {
	switch (data.action) {
		case 'createComposite':
			await createComposite(data.canvas.getContext('2d'), data.frames, ...data.args);

			// postMessage({
			// 	action: 'createComposite'
			// });
			break;
	}
};
