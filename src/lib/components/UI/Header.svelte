<script>
	import { preloadData, pushState, goto } from '$app/navigation';
	import { page } from '$app/stores';

	import Logo from '$lib/components/Logo.svelte';
	import { ToastManager } from '$lib/toast.js';
	import { store as UI } from '$lib/ui.js';
	import { onMount } from 'svelte';

	function onAboutClick(e) {
		if (!$page.url.pathname.startsWith('/about')) {
			e.preventDefault();

			pushState(e.target.href, {
				shallow: true
			});
		}
	}

	function onBack(e) {
		e.preventDefault();
		history.back();
	}

	function onLogoClick(e) {
		if ($page.state.shallow) {
			onBack(e);
		}
	}

	async function onShare() {
		const shareData = {
			title: 'Kinegram',
			text: 'A tool to generate analog animations',
			url: 'https://kinegram.app'
		};

		try {
			window.plausible('User', { props: { action: 'Share' } });
			await navigator.share(shareData);
		} catch (e) {
			ToastManager.add('Error while sharing', {
				delay: 3000
			});
		}
	}

	let canShare = false;

	onMount(() => {
		canShare = 'share' in navigator;
	});
</script>

<header>
	<div class="logo">
		<Logo on:click={onLogoClick} animated={$UI.loading} />
	</div>

	<nav>
		{#if canShare}
			<button class="btn-reset" on:click={onShare}>Share</button>
		{/if}

		{#if $page.state.shallow}
			<a on:click={onBack} href="/">Close</a>
		{:else}
			<a on:click={onAboutClick} href="/about">About</a>
		{/if}
		<a href="https://jthaw.me" target="_blank"><span class="weak">Made by</span> jthawme</a>
	</nav>
</header>

<style lang="scss">
	.logo {
		position: fixed;

		top: var(--outer-padding);
		left: var(--outer-padding);
	}

	nav {
		position: fixed;

		top: var(--outer-padding);
		right: var(--outer-padding);

		display: flex;

		gap: 20px;

		font-size: var(--font-size-small);

		a,
		button {
			color: var(--color-text);
			cursor: pointer;

			@include hover {
				color: vaR(--color-accent);
			}
		}
	}

	.logo,
	nav {
		z-index: 10;
	}

	.weak {
		color: var(--color-grey-3);
	}
</style>
