<script>
	import ResponsiveImage from '$lib/components/ResponsiveImage.svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	console.log(data);
</script>

Blog page

<div class="grid">
	<ResponsiveImage {...data.attributes.thumbnail} withPlaceholder={false} />
	<ResponsiveImage {...data.attributes.thumbnail} />
</div>

<style lang="scss">
	.grid {
		display: grid;

		grid-template-columns: repeat(2, 1fr);

		align-items: flex-start;
	}
</style>
