<script>
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';

	import '$lib/styles/global.scss';
	import Head from '$lib/components/Head.svelte';
	import Header from '$lib/components/UI/Header.svelte';
	import { ToastManager } from '$lib/toast.js';
	import ToastGroup from '$lib/components/UI/Toast/Group.svelte';

	async function checkServiceWorker() {
		const registration = await navigator.serviceWorker.getRegistration();

		if (registration) {
			registration.addEventListener('updatefound', () => {
				ToastManager.add('New version loaded, click to view', {
					action: () => {
						window.location.reload();
					}
				});
			});
		}
	}

	onMount(() => {
		checkServiceWorker();
	});
</script>

<Head />

<ToastGroup />

<Header />

<slot />
