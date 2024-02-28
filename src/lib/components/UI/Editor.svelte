<script>
	import FileSaver from 'file-saver';
	import JSZip from 'jszip';

	import Group from '../Group.svelte';
	import RowToggle from '../Row/Toggle.svelte';
	import RowButton from '../Row/Button.svelte';
	import RowColour from '../Row/Colour.svelte';
	import FramesWindow from './FramesWindow.svelte';
	import AdvancedMenu from './AdvancedMenu.svelte';

	import { store as Settings, dispatch as SettingsDispatch } from '$lib/settings.js';
	import { dispatch as UIDispatch } from '$lib/ui.js';
	import { store as Frames } from '$lib/frames.js';
	import { createBars, createComposite } from '$lib/engine/Kinegram.js';
	import { canvasToBlob, radians } from '$lib/utils.js';
	import {
		KINEGRAM_BARS_NAME,
		KINEGRAM_FRAMES_NAME,
		KINEGRAM_ZIP_NAME,
		TYPE
	} from '$lib/constants.js';
	import { ToastManager } from '$lib/toast.js';

	$: showAdvanced = $Settings.showAdvanced;

	function toggleAdvanced() {
		SettingsDispatch('toggleAdvanced');
	}

	function onRetainColourChange({ target }) {
		SettingsDispatch('setRetainColour', target.checked);
	}

	function onColourChange({ target }) {
		SettingsDispatch('setColour', target.value);
	}

	/**
	 *
	 * @param {HTMLCanvasElement | OffscreenCanvas} canvas
	 * @param {string} title
	 * @param {number} pad
	 *
	 * @returns {HTMLCanvasElement}
	 */
	function frameCanvas(canvas, title, pad = 40) {
		const frameCanvas = document.createElement('canvas');
		frameCanvas.width = canvas.width + pad * 2;
		frameCanvas.height = canvas.height + pad * 2;
		const ctx = frameCanvas.getContext('2d');

		if (!ctx) {
			throw new Error('No context');
		}

		// ctx.fillStyle = 'white';
		// ctx.fillRect(0, 0, frameCanvas.width, frameCanvas.height);

		ctx.drawImage(canvas, pad, pad);

		ctx.strokeStyle = 'black';
		const drawCropMark = () => {
			ctx.save();

			ctx.beginPath();
			ctx.moveTo(0, pad - 1);
			ctx.lineTo(pad * 0.8, pad - 1);
			ctx.moveTo(pad - 1, 0);
			ctx.lineTo(pad - 1, pad * 0.8);
			ctx.stroke();

			ctx.restore();
		};

		[
			{
				x: 0,
				y: 0,
				angle: 0
			},
			{
				x: frameCanvas.width,
				y: 0,
				angle: 90
			},
			{
				x: frameCanvas.width,
				y: frameCanvas.height,
				angle: 180
			},
			{
				x: 0,
				y: frameCanvas.height,
				angle: 270
			}
		].map(({ x, y, angle }) => {
			ctx.save();
			ctx.translate(x, y);
			ctx.rotate(radians(angle));
			drawCropMark();
			ctx.restore();
		});

		ctx.fillStyle = 'black';
		ctx.font = `500 ${frameCanvas.width / 100}px 'F37 Blanka'`;
		ctx.textBaseline = 'bottom';
		ctx.fillText(title, pad * 2, pad);

		ctx.textAlign = 'right';
		ctx.fillText('kinegram.app', frameCanvas.width - pad * 2, pad);

		return frameCanvas;
	}

	/** @type {null | Worker} */
	let worker = null;
	function getKinegramWorker() {
		if (!worker) {
			worker = new Worker(KinegramWorker);
		}

		return worker;
	}

	/**
	 * @returns {Promise<{frames: OffscreenCanvas, bars: OffscreenCanvas}>}
	 */
	async function createComposites(downsize = 1) {
		const a = 1 / $Settings.aspect;

		const width = 1920 * downsize;
		const height = width * a;

		const barWidth = $Frames.total * $Settings.width * downsize;

		const framesCanvas = new OffscreenCanvas(width, height);
		const framesCtx = framesCanvas.getContext('2d');

		const barsCanvas = new OffscreenCanvas(width, height);
		const barsCtx = barsCanvas.getContext('2d');

		if (!framesCtx || !barsCtx) {
			throw new Error('No context found');
		}

		const frameBitmaps = await Promise.all($Frames.frames.map((blob) => createImageBitmap(blob)));
		await createComposite(framesCtx, frameBitmaps, $Settings.type, barWidth, width, height, {
			retainColour: $Settings.retainColour,
			colour: $Settings.colour,
			threshold: $Settings.threshold
		});

		await createBars(
			barsCtx,
			$Settings.type,
			barWidth,
			width,
			height,
			$Frames.total,
			$Settings.colour
		);

		return { frames: framesCanvas, bars: barsCanvas };
	}

	/**
	 * @returns {Promise<{ frames: Blob, bars: Blob }>}
	 */
	async function createDownloadFiles() {
		const { frames, bars } = await createComposites();

		const blob = await canvasToBlob(frameCanvas(frames, `${$Frames.total} frames`), 'image/png');

		const barsBlob = await canvasToBlob(frameCanvas(bars, `${$Frames.total} frames`), 'image/png');

		return {
			frames: blob,
			bars: barsBlob
		};
	}

	async function onDownload() {
		try {
			UIDispatch('setLoading', true);

			window.plausible('User', { props: { action: 'Clicked export' } });

			const { frames, bars } = await createDownloadFiles();

			if ($Settings.asZip) {
				const zip = new JSZip();
				zip.file(KINEGRAM_FRAMES_NAME, frames);
				zip.file(KINEGRAM_BARS_NAME, bars);
				const zipContent = await zip.generateAsync({ type: 'blob' });
				await FileSaver.saveAs(zipContent, KINEGRAM_ZIP_NAME);
			} else {
				await FileSaver.saveAs(frames, KINEGRAM_FRAMES_NAME);
				await FileSaver.saveAs(bars, KINEGRAM_BARS_NAME);
			}

			ToastManager.add('Files downloaded', {
				delay: 3000
			});
		} catch (e) {
			window.plausible('Error', { props: { error: 'download', message: e.message } });

			ToastManager.add('Error downloading files', {
				delay: 3000
			});
		} finally {
			UIDispatch('setLoading', false);
		}
	}

	async function onGif() {
		try {
			UIDispatch('setLoading', true);

			window.plausible('User', { props: { action: 'Clicked gif' } });

			const downsize = 0.5;
			const { frames, bars } = await createComposites(downsize);

			const GIF = await import('gif.js.optimized').then((mod) => mod.default);

			const gif = new GIF({
				workers: 2,
				quality: 10,
				workerScript: '/worker/gif.worker.js'
			});

			const w = (perc) => perc * frames.width;
			const h = (perc) => perc * frames.height;

			const merged = document.createElement('canvas');
			merged.width = w(1);
			merged.height = h(1);

			const ctx = merged.getContext('2d');

			if (!ctx) {
				return;
			}

			const barWidth = $Frames.total * $Settings.width;
			const angleSlice = 360 / (1000 / ($Frames.total * $Settings.width));

			gif.on('finished', function (blob) {
				FileSaver.saveAs(blob, 'kinegram.gif');
			});

			const total = (() => {
				switch ($Settings.type) {
					case TYPE.CIRCULAR:
						return $Settings.smooth ? angleSlice * $Frames.total : $Frames.total;
					default:
						return $Settings.smooth ? barWidth * $Frames.total : $Frames.total;
				}
			})();

			const speed = (() => {
				switch ($Settings.type) {
					case TYPE.CIRCULAR:
						return $Settings.smooth
							? ((1250 / angleSlice) * $Settings.speed) / $Frames.total
							: (1250 * $Settings.speed) / $Frames.total;
					default:
						return $Settings.smooth
							? ((1250 / ($Frames.total * $Settings.width)) * $Settings.speed) / $Frames.total
							: (1250 * $Settings.speed) / $Frames.total;
				}
			})();

			for (let i = 0; i < total; i++) {
				ctx.save();
				ctx.fillStyle = 'white';
				ctx.fillRect(0, 0, w(1), h(1));

				ctx.drawImage(frames, 0, 0, w(1), h(1));

				ctx.translate(w(0.5), h(0.5));

				if ($Settings.type === TYPE.CIRCULAR) {
					ctx.rotate(radians((angleSlice / total) * i));
					ctx.drawImage(bars, -w(0.5), -h(0.5), w(1), h(1));
				} else {
					const x = $Settings.smooth ? i : barWidth * i;
					ctx.rotate(radians($Settings.angle * -10));
					ctx.drawImage(bars, x - w(0.5), -h(0.5), w(1), h(1));
					ctx.drawImage(bars, x - w(1.5), -h(0.5), w(1), h(1));
				}

				ctx.restore();

				gif.addFrame(merged, { delay: speed, copy: true });
			}

			gif.render();
		} catch (e) {
			window.plausible('Error', { props: { error: 'gif', message: e.message } });

			ToastManager.add('Exporting gif error', {
				delay: 3000
			});
		} finally {
			UIDispatch('setLoading', false);
		}
	}
</script>

<div class="editor" class:showAdvanced>
	<div class="editor-wrap">
		<AdvancedMenu />

		<div class="main">
			<div class="main-side main-side--left">
				<Group title="Settings">
					<RowToggle
						title="Retain Colour"
						value={$Settings.retainColour}
						on:change={onRetainColourChange}
					/>
					<RowColour title="Colour" value={$Settings.colour} on:change={onColourChange} />

					<button class="btn-reset link-like" on:click={toggleAdvanced} slot="footer"
						>Advanced</button
					>
				</Group>
			</div>

			<div class="main-middle">
				<FramesWindow />
			</div>

			<div class="main-side main-side--right">
				<Group title="Export">
					<RowButton
						disabled={$Frames.total < 1}
						on:click={onDownload}
						title="Download"
						icon="download"
					/>
					<RowButton disabled={$Frames.total < 1} on:click={onGif} title="Gif" icon="image" />
				</Group>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.editor {
		position: fixed;

		bottom: 0;
		left: 0;
		right: 0;

		z-index: 5;

		&-wrap {
			position: relative;

			filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.05)) drop-shadow(0 3px 8px rgba(0, 0, 0, 0.1));
		}

		@include tablet {
			left: var(--inner-padding);
			right: var(--inner-padding);

			&-wrap {
				position: relative;

				filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.05)) drop-shadow(0 3px 8px rgba(0, 0, 0, 0.1));
			}
		}
	}

	.showAdvanced :global(.advanced) {
		transform: none;
		visibility: visible;
	}

	.main {
		position: relative;

		z-index: 2;

		border-radius: 10px;
		border-radius: 10px 10px 0 0;

		background-color: var(--color-bg);

		overflow: hidden;

		display: grid;

		grid-template-columns: 1fr 1fr;
		grid-template-areas:
			'middle middle'
			'left right';

		&-side {
			&--left {
				grid-area: left;

				border-right: var(--border-width) solid var(--color-grey-1);
			}

			&--right {
				grid-area: right;
			}
		}

		&-middle {
			position: relative;

			border-style: solid;
			border-color: var(--color-grey-1);

			border-width: 0;
			border-left-width: var(--border-width);
			border-right-width: var(--border-width);
			border-bottom-width: var(--border-width);

			min-width: 0;

			display: flex;

			grid-area: middle;
		}

		@include tablet {
			grid-template-columns: 200px 1fr 200px;
			grid-template-areas: 'left middle right';

			column-gap: 10px;

			&-side--left {
				border-right: none;
			}

			&-middle {
				border-bottom-width: 0;
			}
		}
	}
</style>
