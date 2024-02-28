<script>
	import { ToastManager } from '$lib/toast.js';
	import Item from './Item.svelte';

	function onRemove({ detail }) {
		ToastManager.remove(detail);
	}
</script>

<div class="group">
	{#each $ToastManager as toast}
		<Item on:remove={onRemove} {...toast} />
	{/each}
</div>

<style lang="scss">
	.group {
		position: fixed;

		top: 0;
		left: 0;

		width: 100%;

		display: flex;

		flex-direction: column;

		z-index: 20;
	}
</style>
