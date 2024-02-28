<script>
	import Icon from '$lib/components/Icon.svelte';
	import { onMount, createEventDispatcher, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();

	/** @type {string} */
	export let id;

	/** @type {string} */
	export let message;

	/** @type {string} */
	export let type = 'normal';

	/** @type {number | null} */
	export let delay = null;

	/** @type {() => void | null} */
	export let action = null;

	/** @type {ReturnType<typeof setTimeout>}*/
	let timer;

	function onRemove() {
		dispatch('remove', id);
	}

	/**
	 *
	 * @param {number} time
	 */
	function triggerDelay(time) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			onRemove();
		}, time);
	}

	onMount(() => {
		if (delay) {
			triggerDelay(delay);
		}
	});

	onDestroy(() => {
		clearTimeout(timer);
	});

	function onItemClick() {
		if (action) {
			action();
		}
	}
</script>

<div class={`item ${type}`}>
	<button disabled={!action} class="btn-reset item-content" on:click={onItemClick}>{message}</button
	>
	<button on:click={onRemove} class="btn-reset item-close">
		<Icon name="x" />
	</button>
</div>

<style lang="scss">
	.item {
		position: relative;

		display: flex;

		text-align: center;

		background-color: var(--color-accent-light);
		color: var(--color-accent);

		font-size: var(--font-size-small);

		&-content {
			padding: 0.5em 1em;

			text-align: center;

			width: 100%;
			color: inherit;

			&[disabled] {
			}

			&:not([disabled]) {
				cursor: pointer;

				@include hover {
					opacity: 0.5;
				}
			}
		}

		&-close {
			position: absolute;

			top: 50%;
			right: 0;

			padding: 0.5em;

			transform: translateY(-50%);

			line-height: 1;
			cursor: pointer;

			@include hover {
				opacity: 0.5;
			}
		}
	}
</style>
