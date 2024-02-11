<script>
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';

	import '$lib/styles/global.scss';
	import Head from '$lib/components/Head.svelte';
	import { isActive } from '$lib/utils.js';

	/** @type {import('./$types').LayoutData} */
	export let data;

	async function checkServiceWorker() {
		const registration = await navigator.serviceWorker.getRegistration();

		if (registration) {
			registration.addEventListener('updatefound', () => {
				console.log('Service Worker update found!');
			});
		}
	}

	onMount(() => {
		checkServiceWorker();
	});

	$: if ($navigating) console.log('Page navigating');
</script>

<Head />

<header>
	<ul>
		<li><a class:active={isActive('/')} href="/">Home</a></li>
		{#each data.pages as page}
			<li>
				<a class:active={isActive(page.meta.slug)} href={page.meta.slug}>{page.attributes.title}</a>
			</li>
		{/each}
	</ul>
</header>

<slot />
