<script>
	export let value = false;

	/** @type {string} */
	export let name = '';
</script>

<span class="toggle" class:active={!!value}>
	<input type="checkbox" {name} bind:checked={value} on:change on:input />
	<span class="toggle-dot" />
</span>

<style lang="scss">
	.toggle {
		position: relative;

		display: block;

		--internal-toggle-size: var(--toggle-size, 12px);
		--toggle-distance: calc(var(--internal-toggle-size) * 0.75);

		color: var(--color-grey-3);
		background-color: var(--color-grey-1);

		padding-right: var(--toggle-distance);

		border-radius: var(--internal-toggle-size);

		border: 1px solid currentColor;

		transition: {
			duration: 0.35s;
			property: color;
		}

		input {
			display: none;
		}

		&-dot {
			display: block;
			width: var(--internal-toggle-size);
			height: var(--internal-toggle-size);

			border-radius: var(--internal-toggle-size);

			background-color: currentColor;

			transition: {
				duration: 0.35s;
				property: transform;
			}
		}

		&.active {
			color: var(--color-text);

			.toggle-dot {
				transform: translate3d(var(--toggle-distance), 0, 0);
			}
		}
	}
</style>
