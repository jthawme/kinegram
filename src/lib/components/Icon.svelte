<script>
	import { icons } from '$lib/icons/index.js';

	/** @type {import('../icons').IconName}*/
	export let name;

	$: icon = icons[name];
</script>

<span class="icon">
	<svelte:component this={icon} />
</span>

<style lang="scss">
	.icon {
		display: inline-flex;

		width: var(--icon-size, 1em);
		height: var(--icon-size, 1em);

		line-height: 1;

		:global(svg) {
			width: 100%;
			height: 100%;
		}
	}
</style>
