<script>
	import Slider from '../Input/Slider.svelte';
	import Base from './Base.svelte';

	/** @type {string} */
	export let title;

	/** @type {boolean} */
	export let disabled = false;

	export let value = 0;
</script>

<Base {title} {disabled}>
	<Slider bind:value on:change on:input {...$$restProps} />
</Base>
