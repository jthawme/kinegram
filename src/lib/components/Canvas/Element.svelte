<script>
	import { resize } from '$lib/resize.js';
	import {
		store as Settings,
		retainColour as SettingsRetainColour,
		colour as SettingsColour,
		threshold as SettingsThreshold,
		type as SettingsType
	} from '$lib/settings.js';
	import { store as Frames } from '$lib/frames.js';
	import { store as UI, dispatch as UIDispatch } from '$lib/ui.js';
	import { dispatch as FramesDispatch } from '$lib/frames.js';
	import { createBars, createComposite, createFrame } from '$lib/engine/Kinegram.js';
	import Icon from '../Icon.svelte';
	import { debounce, doubleRaf, fileToBlob } from '$lib/utils.js';
	import { MAX_FRAMES } from '$lib/constants.js';
	import { ToastManager } from '$lib/toast.js';

	export let canvasWidth = 1920;

	/** @type {HTMLCanvasElement | null} */
	let canvasEl = null;

	/** @type {HTMLCanvasElement | null} */
	let barsEl = null;

	let outerWidth = 0;
	let outerHeight = 0;

	let scale = 1;

	let loaded = false;

	$: dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;

	$: barWidth = $Frames.total * $Settings.width;

	$: inverseAspect = 1 / $Settings.aspect;

	/**
	 *
	 * @param {{width: number, height: number}} dimensions
	 */
	function onCanvasResize({ width, height }) {
		outerWidth = width;
		outerHeight = height;
	}

	/**
	 *
	 * @param {HTMLCanvasElement | null} canvas
	 * @param {HTMLCanvasElement | null} barsCanvas
	 * @param {number} width
	 * @param {number} height
	 * @param {number} aspect
	 */
	function resizeCanvas(canvas, barsCanvas, width, height, aspect) {
		if (!canvas || !barsCanvas) {
			return;
		}

		loaded = true;

		const dpr = window.devicePixelRatio;

		const wid = canvasWidth;
		const hei = canvasWidth * aspect;

		if (canvas.height !== Math.ceil(hei * dpr)) {
			canvas.width = wid * dpr;
			canvas.height = Math.ceil(hei * dpr);

			barsCanvas.width = wid * dpr;
			barsCanvas.height = Math.ceil(hei * dpr);
		}

		canvas.style.width = `${canvasWidth}px`;
		canvas.style.height = `${canvasWidth * aspect}px`;
		barsCanvas.style.width = `${canvasWidth}px`;
		barsCanvas.style.height = `${canvasWidth * aspect}px`;

		scale = Math.min(width / wid, height / hei);

		debouncedCreated(
			canvasEl,
			$SettingsType,
			barWidth,
			$Frames.frames,
			$SettingsRetainColour,
			$Settings.colour,
			$Settings.threshold
		);
	}

	/**
	 *
	 * @param {HTMLCanvasElement | null} canvas
	 * @param {string} type
	 * @param {number} frameWidth
	 * @param {Blob[]} frames
	 * @param {boolean} retainColour
	 * @param {string} colour
	 * @param {number} threshold
	 */
	async function create(
		canvas,
		type,
		frameWidth,
		frames = $Frames.frames,
		retainColour = $SettingsRetainColour,
		colour = $Settings.colour,
		threshold = $Settings.threshold
	) {
		if (!canvas) {
			return;
		}

		try {
			await doubleRaf();

			const ctx = canvas.getContext('2d');
			const barsCtx = barsEl?.getContext('2d');

			if (!ctx || !barsCtx) {
				throw new Error('No context found');
			}

			barsCtx.clearRect(0, 0, canvas.width, canvas.height);

			if (frames.length === 0) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				return;
			}

			UIDispatch('setLoading', true);
			createBars(barsCtx, type, frameWidth, canvas.width, canvas.height, frames.length, colour);

			const frameBitmaps = await Promise.all($Frames.frames.map((blob) => createImageBitmap(blob)));
			await createComposite(ctx, frameBitmaps, type, frameWidth, canvas.width, canvas.height, {
				retainColour,
				colour,
				threshold
			});
		} catch {
			ToastManager.add('Creating frame error, site possibly needs to be refreshed', {
				action: () => window.location.reload,
				delay: 1000 * 30
			});
		} finally {
			UIDispatch('setLoading', false);
		}
	}

	const debouncedCreated = debounce(create, 500);

	$: resizeCanvas(canvasEl, barsEl, outerWidth, outerHeight, inverseAspect);
	$: create(
		canvasEl,
		$SettingsType,
		barWidth,
		$Frames.frames,
		$SettingsRetainColour,
		$SettingsColour,
		$SettingsThreshold
	);

	$: empty = $Frames.frames.length < 1;

	let dragOver = false;

	function onDragEnter(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	function onDragOver(e) {
		e.stopPropagation();
		e.preventDefault();

		dragOver = true;
	}

	function onDrop(e) {
		onDragCancel(e);

		const dt = e.dataTransfer;
		const files = [...dt.files].filter((file) => file.type.startsWith('image/'));

		processFiles(files);
	}

	function onDragCancel(e) {
		e.stopPropagation();
		e.preventDefault();

		dragOver = false;
	}

	function onFilesChange(e) {
		processFiles([...e.target.files]);
		e.target.value = '';
	}

	/**
	 *
	 * @param {File[]} files
	 */
	async function processFiles(files) {
		UIDispatch('setLoading', true);
		const blobs = await Promise.all(
			files
				.slice(0, $Frames.total < MAX_FRAMES ? MAX_FRAMES - $Frames.total : MAX_FRAMES)
				.map(fileToBlob)
		);

		if (blobs.length) {
			if ($Frames.total >= MAX_FRAMES) {
				blobs.forEach((blob, idx) => FramesDispatch('replace', { index: idx, value: blob }));
			} else {
				blobs.forEach((blob) => FramesDispatch('add', blob));
			}
		}

		UIDispatch('setLoading', false);
	}
</script>

<div
	class="outer"
	class:empty
	class:loaded
	class:dragOver
	class:circular={$SettingsType === 'circular'}
	class:smooth={$Settings.smooth}
	style={`--canvas-width: ${canvasWidth}; --canvas-preview-angle: ${$SettingsType !== 'circular' ? $Settings.angle : 0}; --canvas-aspect: ${inverseAspect}; --canvas-scale: ${scale}; --preview-bar-width: ${barWidth}; --preview-dpr: ${dpr}; --preview-total: ${$Frames.total}; --preview-speed: ${$Settings.speed}`}
	on:dragenter={onDragEnter}
	on:dragover={onDragOver}
	on:drop={onDrop}
	on:dragleave={onDragCancel}
	on:dragend={onDragCancel}
	aria-label="dropzone"
	role="application"
>
	<div class="inner" use:resize={onCanvasResize}>
		<label class="canvas-container">
			<input on:change={onFilesChange} type="file" accept="image/*" multiple />
			<canvas bind:this={canvasEl}></canvas>
			<canvas bind:this={barsEl} class="bars"></canvas>

			{#if empty}
				<div class="empty-container">
					<Icon name="image" />

					{#if dragOver}
						<span class="empty-container-text">Drop!</span>
					{:else}
						<span class="empty-container-text">Drop images or click here to get started</span>
					{/if}
				</div>
			{/if}
		</label>
	</div>
</div>

<style lang="scss">
	.outer {
		position: relative;

		width: 100vw;
		height: calc(100dvh - 100px);

		display: flex;

		align-items: center;
		justify-content: center;

		--canvas-inset: 20px;

		opacity: 0;

		transition: {
			duration: 0.35s;
			property: opacity;
		}

		&.loaded {
			opacity: 1;
		}

		@include tablet {
			--canvas-inset: 50px;
		}
	}

	.inner {
		position: absolute;

		top: var(--canvas-inset);
		right: var(--canvas-inset);
		bottom: var(--canvas-inset);
		left: var(--canvas-inset);
	}

	input {
		opacity: 0;
		pointer-events: none;
	}

	.canvas-container {
		position: absolute;

		top: 50%;
		left: 50%;

		transform: translate3d(-50%, -50%, 0) scale(var(--canvas-scale, 1));

		background-color: var(--color-grey-1);

		width: calc(var(--canvas-width) * 1px);
		height: calc(var(--canvas-width) * var(--canvas-aspect) * 1px);

		overflow: hidden;

		.dragOver & {
			background-color: vaR(--color-accent-mid);
		}
	}

	canvas {
		position: absolute;

		top: 0;
		left: 0;

		width: 100%;
		height: 100%;

		&.bars {
			//opacity: 0;
			z-index: 2;
			background-color: transparent;

			animation: {
				name: PREVIEW;
				duration: calc(1s * var(--preview-speed, 1));
				iteration-count: infinite;
				timing-function: steps(var(--preview-total), start);
			}

			rotate: calc(var(--canvas-preview-angle, 0) * -10deg);

			.circular & {
				animation-name: PREVIEWCIRCULAR;
			}

			.smooth & {
				animation-name: PREVIEWFULL;
				animation-timing-function: linear;
			}

			.smooth.circular & {
				animation-name: PREVIEWCIRCULAR;
				animation-timing-function: linear;
			}
		}
	}

	.empty-container {
		position: absolute;

		top: 50%;
		left: 50%;

		max-width: 300px;

		display: flex;

		flex-direction: column;

		align-items: center;

		transform: translate3d(-50%, -50%, 0) scale(calc(1 / var(--canvas-scale)));

		text-align: center;

		font-size: var(--font-size-large);
		--icon-size: 1.5em;

		color: var(--color-grey-3);

		line-height: 1;

		&-text {
			display: block;

			margin-top: 0.5em;
		}

		.dragOver & {
			color: var(--color-accent);
		}
	}

	@keyframes PREVIEW {
		to {
			transform: translateX(
				calc((var(--preview-bar-width) / var(--preview-dpr)) * (var(--preview-total) - 0) * 1px)
			);
		}
	}

	@keyframes PREVIEWCIRCULAR {
		to {
			transform: rotate(calc((360 / (1000 / var(--preview-bar-width))) * 1deg));
		}
	}

	@keyframes PREVIEWFULL {
		to {
			transform: translateX(
				calc((var(--preview-bar-width) / var(--preview-dpr)) * (var(--preview-total)) * 1px)
			);
		}
	}
</style>
