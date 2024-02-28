<script>
	import Toggle from '../Input/Toggle.svelte';
	import Base from './Base.svelte';

	/** @type {string} */
	export let title;

	/** @type {boolean} */
	export let disabled = false;

	export let value = false;
</script>

<Base {title} {disabled}>
	<Toggle bind:value on:change />
</Base>
