import { brightness, circPoint, hexToRgb } from '../utils.js';

/**
 *
 * @param {OffscreenCanvasRenderingContext2D} ctx
 * @param {number} barWidth
 * @param {number} width
 * @param {number} height
 * @param {number} totalFrames
 * @param {string} colour
 * @param {boolean} invert
 */
export const createRegularBars = (
	ctx,
	barWidth,
	width,
	height,
	totalFrames,
	colour,
	invert = true
) => {
	if (totalFrames === 0) {
		throw new Error('No frames');
	}

	const barSectionWidth = barWidth * totalFrames;

	ctx.save();
	ctx.fillStyle = colour;
	for (let i = -1; i < Math.ceil(width / barSectionWidth); i++) {
		ctx.save();
		ctx.translate(i * barSectionWidth, 0);

		if (invert) {
			ctx.fillRect(barWidth, 0, barSectionWidth - barWidth, height);
		} else {
			ctx.fillRect(0, 0, barWidth, height);
		}
		ctx.restore();
	}
	ctx.restore();
};

/**
 *
 * @param {OffscreenCanvasRenderingContext2D} ctx
 * @param {ImageBitmap} image
 * @param {number} barWidth
 * @param {number} width
 * @param {number} height
 * @param {number} frameIndex
 * @param {number} totalFrames
 * @param {{retainColour: boolean, colour: string, threshold: number}} options
 */
export const createRegularFrame = (
	ctx,
	image,
	barWidth,
	width,
	height,
	frameIndex,
	totalFrames,
	{ retainColour, colour, threshold }
) => {
	if (totalFrames === 0) {
		throw new Error('No frames');
	}

	const b = new OffscreenCanvas(width, height);
	const bCtx = b.getContext('2d');

	if (!bCtx) {
		throw new Error('No context found');
	}
	createRegularBars(bCtx, barWidth, width, height, totalFrames, 'white', false);

	ctx.save();
	ctx.translate(frameIndex * barWidth, 0);
	ctx.drawImage(b, 0, 0);
	ctx.globalCompositeOperation = 'source-atop';

	const s = Math.min(width / image.width, height / image.height);
	const wid = image.width * s;
	const hei = image.height * s;

	ctx.drawImage(image, (width - wid) / 2, (height - hei) / 2, wid, hei);

	if (!retainColour) {
		const rgb = hexToRgb(colour);

		const id = ctx.getImageData(0, 0, width, height);

		for (let i = 0; i < id.data.length; i += 4) {
			if (id.data[i + 3] === 0) {
				continue;
			}

			if (brightness(id.data[i + 0], id.data[i + 1], id.data[i + 2]) < 255 * threshold) {
				id.data[i + 0] = rgb[0];
				id.data[i + 1] = rgb[1];
				id.data[i + 2] = rgb[2];
			} else {
				id.data[i + 0] = 255;
				id.data[i + 1] = 255;
				id.data[i + 2] = 255;
			}
		}

		ctx.putImageData(id, 0, 0);
	}
	ctx.globalCompositeOperation = 'source-over';
	ctx.restore();
};

/**
 *
 * @param {OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D} ctx
 * @param {number} barWidth
 * @param {number} width
 * @param {number} height
 * @param {number} totalFrames
 * @param {string} colour
 * @param {number} [frameIndex]
 * @param {boolean} [invert]
 */
export const createCircularBars = (
	ctx,
	barWidth,
	width,
	height,
	totalFrames,
	colour,
	frameIndex = 0,
	invert = true
) => {
	if (totalFrames === 0) {
		throw new Error('No frames');
	}

	const center = {
		x: width / 2,
		y: height / 2
	};

	const total = 1000 / barWidth;
	const angleSlice = 360 / total;

	const startAngle = angleSlice * ((1 / totalFrames) * frameIndex);

	ctx.fillStyle = colour;
	for (let i = 0; i < total; i++) {
		ctx.beginPath();
		ctx.moveTo(center.x, center.y);

		const getPoints = () => {
			if (invert) {
				const p1 = circPoint(startAngle + angleSlice * (i + 1 / totalFrames), center, width);
				const p2 = circPoint(startAngle + angleSlice * (i + 1), center, width);

				return { p1, p2 };
			} else {
				const p1 = circPoint(startAngle + angleSlice * i, center, width);
				const p2 = circPoint(startAngle + angleSlice * (i + 1 / totalFrames), center, width);

				return { p1, p2 };
			}
		};

		const { p1, p2 } = getPoints();

		ctx.lineTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.fill();
	}
};

/**
 *
 * @param {OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D} ctx
 * @param {ImageBitmap} image
 * @param {number} barWidth
 * @param {number} width
 * @param {number} height
 * @param {number} frameIndex
 * @param {number} totalFrames
 * @param {{retainColour: boolean, colour: string, threshold: number}} options
 */
export const createCircularFrame = (
	ctx,
	image,
	barWidth,
	width,
	height,
	frameIndex,
	totalFrames,
	{ retainColour, colour, threshold }
) => {
	if (totalFrames === 0) {
		throw new Error('No frames');
	}
	const b = new OffscreenCanvas(width, height);
	const bCtx = b.getContext('2d');

	if (!bCtx) {
		throw new Error('No context found');
	}

	createCircularBars(bCtx, barWidth, width, height, totalFrames, 'white', frameIndex, false);

	ctx.save();
	ctx.drawImage(b, 0, 0);
	ctx.globalCompositeOperation = 'source-atop';

	const s = Math.min(width / image.width, height / image.height);
	const wid = image.width * s;
	const hei = image.height * s;

	ctx.drawImage(image, (width - wid) / 2, (height - hei) / 2, wid, hei);

	if (!retainColour) {
		const rgb = hexToRgb(colour);

		const id = ctx.getImageData(0, 0, width, height);

		for (let i = 0; i < id.data.length; i += 4) {
			if (id.data[i + 3] === 0) {
				continue;
			}

			if (brightness(id.data[i + 0], id.data[i + 1], id.data[i + 2]) < 255 * threshold) {
				id.data[i + 0] = rgb[0];
				id.data[i + 1] = rgb[1];
				id.data[i + 2] = rgb[2];
			} else {
				id.data[i + 0] = 255;
				id.data[i + 1] = 255;
				id.data[i + 2] = 255;
			}
		}

		ctx.putImageData(id, 0, 0);
	}

	ctx.restore();
};

/**
 *
 * @param {OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D} ctx
 * @param {string} type
 * @param {ImageBitmap} image
 * @param {number} barWidth
 * @param {number} width
 * @param {number} height
 * @param {number} frameIndex
 * @param {number} totalFrames
 * @param {{retainColour: boolean, colour: string, threshold: number}} options
 */
export const createFrame = (
	ctx,
	type,
	image,
	barWidth,
	width,
	height,
	frameIndex,
	totalFrames,
	{ retainColour, colour, threshold }
) => {
	switch (type) {
		case 'circular':
			return createCircularFrame(ctx, image, barWidth, width, height, frameIndex, totalFrames, {
				retainColour,
				colour,
				threshold
			});
		case 'regular':
		default:
			return createRegularFrame(ctx, image, barWidth, width, height, frameIndex, totalFrames, {
				retainColour,
				colour,
				threshold
			});
	}
};

/**
 *
 * @param {OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D} ctx
 * @param {string} type
 * @param {number} barWidth
 * @param {number} width
 * @param {number} height
 * @param {number} totalFrames
 * @param {string} colour
 */
export const createBars = (ctx, type, barWidth, width, height, totalFrames, colour) => {
	switch (type) {
		case 'circular':
			return createCircularBars(ctx, barWidth, width, height, totalFrames, colour);
		case 'regular':
		default:
			return createRegularBars(ctx, barWidth, width, height, totalFrames, colour);
	}
};

/**
 *
 * @param {OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D} ctx
 * @param {ImageBitmap[]} frames
 * @param {string} type
 * @param {number} barWidth
 * @param {number} width
 * @param {number} height
 * @param {{retainColour: boolean, colour: string, threshold: number}} options
 */
export const createComposite = async (
	ctx,
	frames,
	type,
	barWidth,
	width,
	height,
	{ retainColour = false, colour = '#000000', threshold = 0.5 }
) => {
	if (frames.length === 0) {
		ctx.clearRect(0, 0, width, height);
	}

	const frameCanvases = frames.map((bitmap, idx) => {
		const c = new OffscreenCanvas(width, height);
		const cCtx = c.getContext('2d');

		if (!cCtx) {
			return null;
		}

		createFrame(cCtx, type, bitmap, barWidth, width, height, idx, frames.length, {
			retainColour,
			colour,
			threshold
		});

		return c;
	});

	ctx.clearRect(0, 0, width, height);

	frameCanvases.forEach((f) => {
		if (f) {
			ctx.drawImage(f, 0, 0);
		}
	});
};
