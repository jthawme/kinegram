<script>
	import Icon from '../Icon.svelte';
	import Base from './Base.svelte';

	/** @type {string} */
	export let title;

	/** @type {boolean} */
	export let disabled = false;

	/** @type {import('../../icons').IconName | null}*/
	export let icon = null;
</script>

<Base on:click tag="button" {disabled} {title}>
	{#if icon}
		<Icon name={icon} />
	{:else}
		<slot />
	{/if}
</Base>
