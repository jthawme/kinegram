<script>
	import TrackFrame from '$lib/components/Track/Frame.svelte';
	import TrackRunner from '$lib/components/Track/Runner.svelte';
	import { MAX_FRAMES } from '$lib/constants.js';
	import { store as Frames, dispatch as FramesDispatch } from '$lib/frames.js';
	import Icon from '../Icon.svelte';

	$: fullFrames = new Array(MAX_FRAMES).fill(null).map((_, idx) => $Frames.frames[idx] ?? null);

	/** @type {HTMLDivElement | null} */
	let inner = null;

	function onFile(file, idx) {
		if (idx >= $Frames.frames.length) {
			FramesDispatch('add', file);
		} else {
			FramesDispatch('replace', {
				index: idx,
				value: file
			});
		}
	}

	function onFileRemove(idx) {
		FramesDispatch('remove', idx);
	}

	function onFileDuplicate(idx) {
		FramesDispatch('add', $Frames.frames[idx]);
	}

	function onLeft() {
		inner?.scrollBy({
			left: (inner?.querySelector('.frame')?.getBoundingClientRect().width || 0) * -1,
			behavior: 'smooth'
		});
	}

	function onRight() {
		inner?.scrollBy({
			left: inner?.querySelector('.frame')?.getBoundingClientRect().width || 0,
			behavior: 'smooth'
		});
	}
</script>

<div class="window">
	<button on:click={onLeft} class="btn-reset arrow arrow-left">
		<Icon name="back" />
	</button>

	<div bind:this={inner} class="window-inner">
		<TrackRunner>
			{#each fullFrames as frame, idx}
				<TrackFrame
					blob={frame}
					on:file={({ detail }) => onFile(detail, idx)}
					on:remove={({ detail }) => onFileRemove(idx)}
					on:duplicate={() => onFileDuplicate(idx)}
					canDuplicate={$Frames.total < MAX_FRAMES}
				/>
			{/each}
		</TrackRunner>
	</div>

	<button on:click={onRight} class="btn-reset arrow arrow-right">
		<Icon name="forward" />
	</button>
</div>

<style lang="scss">
	.window {
		position: relative;

		min-width: 0;
		width: 100%;

		display: flex;
	}

	.window-inner {
		overflow: auto;

		display: flex;

		align-items: center;

		width: 100%;

		padding: 10px 30px;

		@include tablet {
			padding: 10px 20px;

			scroll-snap-type: x proximity;
		}
	}

	.arrow {
		position: absolute;

		height: 80px;
		width: 20px;

		border-radius: 5px;

		display: flex;

		align-items: center;
		justify-content: center;

		font-size: var(--font-size-x-small);

		background-color: var(--color-text);
		color: var(--color-bg);

		z-index: 5;

		top: 50%;

		&-left {
			left: 15px;

			transform: translate3d(-50%, -50%, 0);
		}

		&-right {
			right: 15px;

			transform: translate3d(50%, -50%, 0);
		}

		@include hover {
			cursor: pointer;

			color: var(--color-grey-3);
		}

		@include tablet {
			&-left {
				left: 0;
			}

			&-right {
				right: 0;
			}
		}
	}
</style>
