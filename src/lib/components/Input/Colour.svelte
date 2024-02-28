<script>
	/** @type {string} */
	export let value = '#fff';

	/** @type {string} */
	export let name = '';

	export let disabled = false;
</script>

<span class="outer" class:disabled class:active={!!value} style={`--color: ${value}`}>
	<input type="color" {disabled} {name} bind:value on:change on:input />
</span>

<style lang="scss">
	.outer {
		position: relative;

		display: inline-block;

		height: var(--input-height, 1em);
		aspect-ratio: 4/3;

		color: var(--color);
		background-color: currentColor;
		border-radius: 2px;

		outline: 1px solid var(--color-grey-1);

		transition: {
			duration: 0.35s;
			property: color;
		}

		input {
			position: absolute;

			width: 0;
			height: 0;

			opacity: 0;
		}

		&.disabled {
			opacity: 0.5;
		}
	}
</style>
