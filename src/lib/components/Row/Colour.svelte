<script>
	import Colour from '../Input/Colour.svelte';
	import Base from './Base.svelte';

	/** @type {string} */
	export let title;

	/** @type {boolean} */
	export let disabled = false;

	export let value = '#ffffff';
</script>

<Base {title} {disabled}>
	<Colour {disabled} bind:value on:change on:input />
</Base>
