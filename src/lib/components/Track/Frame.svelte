<script>
	import { createEventDispatcher } from 'svelte';
	import Icon from '../Icon.svelte';
	import { fileToBlob, listenCb } from '$lib/utils.js';

	const dispatch = createEventDispatcher();

	/** @type {string} */
	export let ratio = '29.7/21';

	/** @type {string | null} */
	export let image = null;

	/** @type {Blob | null}*/
	export let blob = null;

	export let canDuplicate = true;

	let busy = false;

	let loaded = false;

	/** @type {HTMLInputElement | null}*/
	let inputEl = null;

	function onRemove() {
		if (busy) {
			return;
		}

		dispatch('remove');
	}

	function onDuplicate() {
		if (busy) {
			return;
		}

		dispatch('duplicate');
	}

	async function onFile(e) {
		if (busy || e.target.files.length === 0) {
			return;
		}

		busy = true;

		const file = e.target.files[0];

		const blob = await fileToBlob(file);

		dispatch('file', blob);
		inputEl.value = '';
		busy = false;
	}

	/**
	 *
	 * @param {string | null} [_image]
	 * @param {Blob | null} [_blob]
	 * @returns {string | null}
	 */
	function resolveImage(_image, _blob) {
		if (_image) {
			return _image;
		}

		if (_blob) {
			return window.URL.createObjectURL(_blob);
		}

		return null;
	}

	function onImageLoad() {
		loaded = true;
	}

	$: resolvedImage = resolveImage(image, blob);
	$: empty = !resolvedImage;

	$: if (empty) {
		loaded = false;
	}
</script>

<span class="frame-container">
	<div class="frame-outer" class:loaded class:empty class:busy style={`--ratio: ${ratio}`}>
		<label class="frame">
			<input bind:this={inputEl} type="file" accept="image/*" on:change={onFile} />
			{#if resolvedImage}
				<img src={resolvedImage} alt="" on:load={onImageLoad} />
			{:else}
				<Icon name="plus" />
			{/if}
		</label>

		{#if !empty}
			<div class="options">
				<button on:click={onRemove} class="btn-reset">
					<Icon name="x" />
				</button>
				{#if canDuplicate}
					<button on:click={onDuplicate} class="btn-reset">
						<Icon name="duplicate" />
					</button>
				{/if}
			</div>
		{/if}
	</div>
</span>

<style lang="scss">
	.frame-container {
		display: flex;
	}

	.frame-outer {
		position: relative;

		display: flex;

		aspect-ratio: var(--ratio, 29.7/21);

		border-radius: 5px;

		overflow: hidden;
		isolation: isolate;

		border: 1px solid currentColor;
		color: var(--color-grey-3);

		scroll-snap-align: start;
		scroll-margin-inline: 20px;

		background-color: var(--color-bg);

		@include hover {
			color: var(--color-text);
		}
	}

	.frame {
		width: 100%;
		height: 100%;

		cursor: pointer;

		input {
			position: absolute;
			width: 0;
			height: 0;
		}

		img {
			width: 100%;
			height: 100%;

			padding: 5px;

			object-fit: contain;

			opacity: 0;

			transition: {
				duration: 0.35s;
				property: opacity;
				delay: 0.15s;
			}

			.loaded & {
				opacity: 1;
			}
		}
	}

	.empty {
		border: 1px dashed currentColor;

		.frame {
			display: flex;

			align-items: center;
			justify-content: center;

			font-size: var(--font-size-large);
		}
	}

	.options {
		position: absolute;

		top: 0;
		right: 0;

		display: flex;

		flex-direction: column;

		gap: 2px;

		padding: 5px;

		button {
			user-select: none;
			@include hover {
				cursor: pointer;

				color: var(--color-accent);
			}
		}
	}
</style>
