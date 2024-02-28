<script>
	export let value = 0;

	export let min = 0;
	export let max = 1;
	export let step = 0.1;

	/** @type {string} */
	export let name = '';
</script>

<span class="slider">
	<input type="range" {name} {min} {max} {step} bind:value on:change on:input />
</span>

<style lang="scss">
	.slider {
		display: inline-flex;

		input {
			-webkit-appearance: none;
			appearance: none;
			background: transparent;
			cursor: pointer;
			width: var(--slider-width, 3em);
		}

		input[type='range']::-webkit-slider-runnable-track {
			background: var(--color-grey-1);
			height: 0.3em;
			border-radius: 1em;
			border: 0.5px solid var(--color-grey-3);
		}

		input[type='range']::-webkit-slider-thumb {
			-webkit-appearance: none; /* Override default look */
			appearance: none;
			margin-top: calc(0.3em / 2 - 1em / 2); /* Centers thumb on the track */
			background-color: var(--color-grey-3);
			height: 1em;
			width: 1em;

			border-radius: 1em;
		}

		input[type='range']:active::-webkit-slider-thumb {
			background-color: var(--color-accent);
		}

		/******** Firefox ********/
		input[type='range']::-moz-range-track {
			background: var(--color-grey-1);
			height: 0.5rem;
		}
	}
</style>
