<script>
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import Icon from '../Icon.svelte';
	import Logo from '../Logo.svelte';
	import { fade } from 'svelte/transition';
	import { listenCb } from '$lib/utils.js';

	const dispatch = createEventDispatcher();

	function onClose() {
		dispatch('close');
	}

	/** @type {ReturnType<typeof setTimeout} */
	let timer;

	onMount(() => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			onClose();
		}, 1000 * 60);

		const unlisten = listenCb(document, 'click', () => {
			onClose();
		});

		return () => {
			unlisten();
			clearTimeout(timer);
		};
	});
</script>

<div in:fade={{ delay: 500, duration: 500 }} out:fade={{ duration: 350 }} class="announcement">
	<div class="announcement-figure">
		<Logo animated />
	</div>
	<div class="announcement-content">
		<p class="lead">
			Welcome to Kinegram 2.0. Same great experience, now more performant than ever.
		</p>
		<p>
			The <b>Advanced</b> button in the editor opens a whole new landscape of possibilities, including
			different playback methods, circular kinegrams, thresholding and keeping the full colour of your
			images
		</p>
	</div>

	<button class=" close btn-reset">
		<Icon name="x" />
	</button>
</div>

<style lang="scss">
	.announcement {
		position: fixed;

		top: calc(50% - var(--inner-padding));
		left: 50%;

		transform: translate3d(-50%, -50%, 0);

		max-width: 500px;

		width: calc(100% - var(--inner-padding));

		border-radius: 10px;

		padding: 2em 3em 2em 2em;

		background-color: var(--color-accent-light);

		z-index: 30;

		display: grid;

		grid-template-columns: auto 1fr;
		gap: 1em;

		--logo-color: var(--color-accent);

		filter: drop-shadow(0 3px 4px rgba(0, 0, 0, 0.05)) drop-shadow(0 3px 8px rgba(0, 0, 0, 0.1));

		.close {
			position: absolute;

			top: 10px;
			right: 10px;

			padding: 1em;

			cursor: pointer;

			@include hover {
				color: var(--color-grey-3);
			}
		}

		p {
			font-size: var(--font-size-x-small);

			margin: 0 auto 0.5em;

			b {
				font-weight: 500;
				color: var(--color-accent);
			}

			&:last-child {
				margin-bottom: 0;
			}

			&.lead {
				font-size: var(--font-size-normal);
				color: var(--color-accent);

				line-height: 1.2;
			}
		}
	}
</style>
