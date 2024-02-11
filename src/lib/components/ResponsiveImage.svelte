<script>
	/**
	 * @typedef {object} PictureSource
	 * @property {string} type
	 * @property {string} [srcset]
	 * @property {string} [src]
	 * @property {string} sizes
	 */

	/** @type {string}*/
	export let fallback;

	/** @type {PictureSource[]}*/
	export let sources;

	/** @type {{ src: string, sources: PictureSource[]}}*/
	export let placeholder;

	/** @type {string}*/
	export let color;

	/** @type {number}*/
	export let aspectRatio;

	// /** @type {number}*/
	// export let width;

	// /** @type {number}*/
	// export let height;

	/** @type {string}*/
	export let alt = '';

	/** @type {string}*/
	export let title;

	export let withPlaceholder = true;

	// Whether the main image has loaded
	let loaded = false;

	function onImageLoad() {
		loaded = true;
	}
</script>

<span class="image" style={`--aspect: ${aspectRatio}; --color: ${color}`} class:loaded>
	{#if withPlaceholder}
		<picture class="placeholder">
			{#each placeholder.sources as source}
				<source {...source} />
			{/each}
			<img src={placeholder.src} alt="" loading="eager" />
		</picture>
	{:else}
		<span class="spacer" />
	{/if}

	<picture class="full">
		{#each sources as source}
			<source {...source} />
		{/each}
		<img src={fallback} {alt} title={title || alt} loading="lazy" on:load={onImageLoad} />
	</picture>
</span>

<style lang="scss">
	.image {
		position: relative;

		display: block;

		line-height: 0;
	}

	.spacer {
		display: block;

		width: 100%;
		padding-bottom: calc(100% * var(--aspect));

		background-color: var(--color);
	}

	.placeholder,
	.full {
		display: block;

		img {
			display: block;

			width: 100%;
		}
	}

	.spacer,
	.placeholder {
		pointer-events: none;

		transition: {
			duration: 0.25s;
			delay: 0.05s;
			property: opacity;
		}
	}

	.full {
		position: absolute;

		top: 0;
		left: 0;

		width: 100%;
		height: 100%;

		z-index: 2;

		opacity: 0;

		transition: {
			duration: 0.25s;
			property: opacity;
		}
	}

	.loaded {
		.full {
			opacity: 1;
		}

		// .spacer,
		// .placeholder {
		// 	opacity: 0;
		// }
	}
</style>
