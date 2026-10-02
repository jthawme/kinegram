<script>
	/** @type {string | null}*/
	export let title = null;

	/** @type {string | null}*/
	export let subtitle = null;

	/** @type {'column' | 'row'} */
	export let direction = 'column';
</script>

<div class={`group ${direction}`}>
	{#if title || subtitle}
		<span class="top">
			{#if title}<span class="title">{title}</span>{/if}
			{#if subtitle}<span class="subtitle">{subtitle}</span>{/if}
		</span>
	{/if}

	<div class="content">
		<slot />
	</div>

	{#if $$slots.footer}
		<span class="footer">
			<slot name="footer" />
		</span>
	{/if}
</div>

<style lang="scss">
	.group {
		font-size: var(--font-size-small);

		padding: 15px 20px;
	}

	.top,
	.footer {
		display: inline-block;

		font-size: var(--font-size-x-small);
	}

	.top {
		display: flex;

		justify-content: space-between;

		padding-bottom: 5px;
	}

	.subtitle {
		color: var(--color-accent);
	}

	.footer {
		padding-top: 5px;
	}

	.content {
		display: flex;
	}

	.column .content {
		flex-direction: column;
	}

	.row .content {
		flex-direction: column;

		@include tablet {
			flex-direction: row;
			gap: 20px;
		}
	}
</style>
