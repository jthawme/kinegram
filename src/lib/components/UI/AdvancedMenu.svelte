<script>
	import Group from '../Group.svelte';

	import RowToggle from '../Row/Toggle.svelte';
	import RowButton from '../Row/Button.svelte';
	import RowSlider from '../Row/Slider.svelte';

	import { store as Settings, dispatch as SettingsDispatch } from '$lib/settings.js';
	import {
		ASPECT,
		ASPECT_DISPLAY,
		BAR_WIDTH,
		BAR_WIDTH_DISPLAY,
		SPEED,
		SPEED_DISPLAY,
		TYPE
	} from '$lib/constants.js';
	import Icon from '../Icon.svelte';
	import { clickOutside, doubleRaf } from '$lib/utils.js';

	/** @type {null | HTMLElement}*/
	let el = null;

	function onWidthChange() {
		const barWidthValues = Object.values(BAR_WIDTH);

		const idx = barWidthValues.indexOf($Settings.width);
		SettingsDispatch('setWidth', barWidthValues[(idx + 1) % barWidthValues.length]);
	}

	function onSpeedChange() {
		const speedValues = Object.values(SPEED);

		const idx = speedValues.indexOf($Settings.speed);
		SettingsDispatch('setSpeed', speedValues[(idx + 1) % speedValues.length]);
	}

	function onAspectChange() {
		const aspectValues = Object.values(ASPECT);

		const idx = aspectValues.indexOf($Settings.aspect);
		SettingsDispatch('setAspect', aspectValues[(idx + 1) % aspectValues.length]);
	}

	function onCircularChange({ target }) {
		SettingsDispatch('setType', target.checked ? TYPE.CIRCULAR : TYPE.REGULAR);
	}

	function onSmoothChange({ target }) {
		SettingsDispatch('setSmooth', target.checked);
	}

	function onAsZipChange({ target }) {
		SettingsDispatch('setAsZip', target.checked);
	}

	function onAsSvgChange({ target }) {
		SettingsDispatch('setAsSvg', target.checked);
	}

	function onThresholdChange({ target }) {
		SettingsDispatch('setThreshold', target.value);
	}

	function onAngleChange({ target }) {
		SettingsDispatch('setAngle', target.value);
	}

	function onReset() {
		SettingsDispatch('reset');
	}

	/** @type {null | (() => void)}*/
	let unlistenClickOutside = null;

	$: if ($Settings.showAdvanced && el && !unlistenClickOutside) {
		doubleRaf().then(() => {
			unlistenClickOutside = clickOutside(el, () => {
				SettingsDispatch('setAdvanced', false);
			});
		});
	} else if (!$Settings.showAdvanced && unlistenClickOutside) {
		unlistenClickOutside();
		unlistenClickOutside = null;
	}
</script>

<div bind:this={el} class="advanced" aria-hidden={!$Settings.showAdvanced}>
	<div class="advanced-group">
		<Group title="Process" direction="row">
			<RowButton title="Thickness" on:click={onWidthChange}
				>{BAR_WIDTH_DISPLAY[$Settings.width]}</RowButton
			>
			<RowSlider
				min={0.1}
				max={0.9}
				title="Threshold"
				on:change={onThresholdChange}
				value={$Settings.threshold}
			/>
		</Group>
	</div>

	<div class="advanced-group">
		<Group title="Preview" direction="row">
			<RowButton title="Speed" on:click={onSpeedChange}>{SPEED_DISPLAY[$Settings.speed]}</RowButton>
			<RowToggle title="Smooth" value={$Settings.smooth} on:change={onSmoothChange} />
			<RowSlider
				disabled={$Settings.type === 'circular'}
				title="Angle"
				on:input={onAngleChange}
				min={-1}
				max={1}
				value={$Settings.angle}
			/>
		</Group>
	</div>

	<div class="advanced-group">
		<Group title="Document" direction="row">
			<RowButton title="Aspect Ratio" on:click={onAspectChange}
				>{ASPECT_DISPLAY[$Settings.aspect]}</RowButton
			>
			<RowToggle
				title="Circular"
				value={$Settings.type === TYPE.CIRCULAR}
				on:change={onCircularChange}
			/>
		</Group>
	</div>

	<div class="advanced-group">
		<Group title="Export" direction="row">
			<RowToggle title="Export as Zip" value={$Settings.asZip} on:change={onAsZipChange} />
			<!-- <RowToggle title="Export as SVG" value={$Settings.asSvg} on:change={onAsSvgChange} /> -->
		</Group>
	</div>

	<div class="advanced-group">
		<Group title="Settings" direction="row">
			<RowButton title="Reset" on:click={onReset} />
		</Group>
	</div>

	<button class="btn-reset close" on:click={() => SettingsDispatch('setAdvanced', false)}
		><Icon name="x" /> Close</button
	>
</div>

<style lang="scss">
	.advanced {
		position: absolute;

		bottom: 100%;

		z-index: 1;

		border-radius: 10px 10px 0 0;

		background-color: var(--color-accent-light-opacity);

		padding-bottom: 10px;
		margin-bottom: -10px;

		width: 100%;

		transform: translate3d(0, calc(100% + 10px), 0);
		visibility: hidden;

		transition: {
			duration: 0.35s;
			property: transform, visibility;
		}

		max-height: calc(100dvh - 250px);
		overflow: auto;

		@include tablet {
			display: flex;

			flex-wrap: wrap;

			justify-content: flex-start;

			overflow: hidden;
			background-color: var(--color-accent-light);
		}

		&-group {
			--row-min-width: 140px;
			--row-hover-bg: var(--color-accent-mid);

			border: var(--border-width) solid var(--color-accent-mid);
			border-bottom: none;
			border-right: none;
			margin-top: -1px;
			margin-left: -1px;

			flex-grow: 1;

			// &:not(:last-of-type) {
			// 	border-right: var(--border-width) solid var(--color-accent-mid);
			// }
		}
	}

	.close {
		position: absolute;

		top: 1em;
		right: 1em;

		font-size: var(--font-size-x-small);

		display: flex;

		align-items: center;

		gap: 0.35em;

		color: var(--color-accent);

		cursor: pointer;

		@include hover {
			color: var(--color-accent-mid);
		}
	}
</style>
