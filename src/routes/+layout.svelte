<script>
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';

	import '$lib/styles/global.scss';
	import Head from '$lib/components/Head.svelte';
	import Header from '$lib/components/UI/Header.svelte';
	import { ToastManager } from '$lib/toast.js';
	import ToastGroup from '$lib/components/UI/Toast/Group.svelte';
	import { getPersistedValue, persistValue } from '$lib/utils.js';
	import Announcement from '$lib/components/UI/Announcement.svelte';

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

	let isNew = false;

	function onCloseAnnouncement() {
		isNew = false;
	}

	onMount(() => {
		isNew = !getPersistedValue('seen', false, (val) => !!val);

		persistValue('seen', '1');

		checkServiceWorker();
	});
</script>

{#if isNew}
	<Announcement on:close={onCloseAnnouncement} />
{/if}

<Head />

<ToastGroup />

<Header />

<slot />
