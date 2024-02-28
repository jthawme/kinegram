<script>
	import { browser } from '$app/environment';
	import Lines from '$lib/images/logo-lines.svg?component';
	import { onDestroy } from 'svelte';

	export let animated = false;
</script>

<a class="container" class:animated href="/" on:click>
	<span class="inner">
		<svelte:component this={Lines} class="lines lines-one" />
		<svelte:component this={Lines} class="lines lines-two" />
	</span>

	<h1>Kinegram</h1>
</a>

<style lang="scss">
	.container {
		display: inline-block;

		width: 16px;

		color: var(--logo-color, var(--color-text));

		--rotate: 15deg;

		@include hover {
			--rotater: -5deg !important;
			color: var(--color-text);
		}

		@include tablet {
			width: 36px;
		}
	}

	h1 {
		display: none;
	}

	.inner {
		position: relative;

		width: 100%;
		padding-bottom: 170%;

		overflow: hidden;

		display: block;

		:global(.lines) {
			position: absolute;

			top: 50%;
			left: 50%;

			transform: translate3d(-50%, -50%, 0);

			width: 140%;
		}

		:global(.lines-one) {
			transform: translate3d(-50%, -50%, 0) rotate(var(--rotater, -10deg));

			transition: {
				duration: 0.75s;
				property: transform;
			}
		}
	}

	.animated .inner :global(.lines-one) {
		transition: none;

		animation: {
			name: ANIMATE;
			direction: alternate;
			duration: 1s;
			iteration-count: infinite;
		}
	}

	@keyframes ANIMATE {
		from {
			transform: translate3d(-50%, -50%, 0) rotate(15deg);
		}

		to {
			transform: translate3d(-50%, -50%, 0) rotate(-15deg);
		}
	}
</style>
