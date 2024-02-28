<script>
	import { page } from '$app/stores';
	import CanvasElement from '$lib/components/Canvas/Element.svelte';
	import Editor from '$lib/components/UI/Editor.svelte';

	import AboutPage from './about/+page.svelte';
</script>

<CanvasElement />

<Editor />

{#if $page.state.shallow}
	<div class="overlay">
		<AboutPage />
	</div>
{/if}

<style lang="scss">
	.overlay {
		position: fixed;

		top: 0;
		right: 0;
		bottom: 0;
		left: 0;

		overflow: auto;

		background-color: var(--color-bg-opacity);

		z-index: 9;
	}
</style>
