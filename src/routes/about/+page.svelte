<main>
	<section>
		<h1 class="title">Kinegram</h1>
		<span class="subtitle"
			>Barrier Grid Animation / Picket Fence Animation / Moire Animation / Scanimation / Lenticular
			Animation</span
		>

		<p>
			They go by many names, but they are all methods of creating animations in a analogue static
			way. You can read more about them here.
		</p>
		<p>
			This free scanimation generator tool allows you to quickly create these animations and export
			them for your own usage.
		</p>
		<p>
			Drag images onto the animation canvas and watch as they are transformed into a kinegram. You
			can then export the print files needed to bring them to life.
		</p>
	</section>

	<section>
		<h2>Author</h2>

		<p>
			Made by <a href="https://jthaw.me?utm=kinegram" target="_blank">jthawme</a><br />
			View the code on
			<a href="https://github.com/jthawme/kinegram" target="_blank">github</a>
		</p>
	</section>

	<!-- <section class="small">
		<h2>CLI Tool</h2>

		<p>
			An experimental version of this tool as a CLI tool is also available on the
			<a href="https://github.com/jthawme/kinegram" target="_blank">github repo</a>.<br />This will
			allow you to generate the files locally, on directories.
		</p>
	</section> -->
</main>

<style lang="scss">
	main {
		margin: auto;

		padding: 4rem var(--inner-padding);

		p {
			padding-right: var(--inner-padding);

			line-height: 1.2;

			@include tablet {
				font-size: var(--font-size-large);
				max-width: 75%;
				padding-right: 0;
			}
		}

		@include tablet {
			padding: 4rem calc(var(--inner-padding) * 2);
		}
	}

	.title {
		font-size: clamp(24px, 15vw, 96px);

		margin: 0 0 -0.1em -0.05em;
	}

	.subtitle {
		color: var(--color-grey-3);

		@include tablet {
			font-size: var(--font-size-large);
		}
	}

	section {
		&:not(:last-of-type) {
			padding: 0 0 1rem;
		}
	}

	.small {
		p {
			font-size: var(--font-size-small);
		}
	}
</style>
