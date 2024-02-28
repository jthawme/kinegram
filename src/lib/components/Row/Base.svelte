<script>
	/** @type {string} */
	export let tag = 'label';

	/** @type {string} */
	export let title;

	/** @type {boolean} */
	export let disabled = false;

	/** @type {'stretch' | 'start' | 'center' | 'end'}*/
	export let align = 'stretch';
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element this={tag} on:click class:disabled class={`row ${align}`} {...$$restProps}>
	<span class="row-title">
		{title}
	</span>

	<span class="row-content">
		<slot />
	</span>
</svelte:element>

<style lang="scss">
	.row {
		display: flex;

		border-radius: 5px;

		--internal-row-padding-x: 5px;
		--internal-row-padding-y: 4px;

		align-items: var(--row-align, stretch);

		padding: var(--row-padding-y, var(--internal-row-padding-y))
			var(--row-padding-x, var(--internal-row-padding-x));
		margin: 0 calc(var(--row-padding-x, var(--internal-row-padding-x)) * -1);

		width: 100%;
		min-width: var(--row-min-width, 0);

		border: none;

		gap: 10px;

		color: var(--color-text);
		background-color: transparent;

		&.disabled {
			color: vaR(--color-grey-3);
		}

		&.start {
			--row-align: flex-start;
		}

		&.center {
			--row-align: center;
		}

		&.end {
			--row-align: flex-end;
		}

		&-title {
			flex-grow: 1;

			text-align: left;
		}

		&-content {
			display: flex;

			flex-direction: column;

			justify-content: var(--row-content-justify, center);
			align-items: var(--row-content-align, stretch);

			padding: var(--row-content-padding, 0);
		}

		@include hover {
			color: var(--color-accent);
			background-color: var(--row-hover-bg, var(--color-grey-1));

			cursor: pointer;
		}
	}
</style>
