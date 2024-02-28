<script>
	// @ts-nocheck

	/** @type {string} */
	export let title = '';

	/** @type {string} */
	export let description = '';

	/** @type {string} */
	export let seperator = ' – ';

	/** @type {string | null} */
	export let image = null;
	// export let favicon = null;
	/** @type {string} */
	export let domain = 'https://kinegram.app';

	/** @type {string} */
	export let defaultTitle = 'Kinegram';
	/** @type {string} */
	export let defaultDescription = 'A tool to generate analog animations';
	/** @type {string | null} */
	export let defaultImage = '/social/social.twitter.png';

	/** @type {string | null} */
	export let defaultFacebookImage = '/social/social.facebook.png';

	$: formattedTitle = title ? [title, defaultTitle].join(seperator) : defaultTitle;
	$: resolvedDescription = description || defaultDescription;
	$: resolvedTwitterImage = [domain, image || defaultImage].join('');
	$: resolvedFacebookImage = [domain, image || defaultFacebookImage].join('');

	$: defaultMeta = [
		{ charset: 'utf-8' },
		{
			name: 'viewport',
			content:
				'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0'
		},
		{ name: 'referrer', content: 'no-referrer' },
		{
			name: 'description',
			content: description
		},
		{
			name: 'twitter:card',
			content: 'summary_large_image'
		},
		{
			name: 'twitter:title',
			content: formattedTitle
		},
		{
			name: 'twitter:description',
			content: resolvedDescription
		},
		resolvedTwitterImage
			? {
					name: 'twitter:image:src',
					content: resolvedTwitterImage
				}
			: false,
		{
			name: 'og:title',
			property: 'og:title',
			content: formattedTitle
		},
		{ name: 'og:type', property: 'og:type', content: 'website' },
		{
			name: 'og:url',
			property: 'og:url',
			content: `${domain}`
		},
		resolvedFacebookImage
			? {
					name: 'og:image',
					property: 'og:image',
					content: resolvedFacebookImage
				}
			: false,
		{
			name: 'og:description',
			property: 'og:description',
			content: resolvedDescription
		},
		{
			name: 'og:site_name',
			property: 'og:site_name',
			content: formattedTitle
		},
		{
			name: 'keywords',
			content:
				'analogue animation, analog animation, barrier grid animation, scanimation, moire animation, animation generator, barrier grid animation generator, scanimation generator, moire animation generator, kinegram, kinegram generator, real life gif, harry potter photos, analogue gif, analog gif'
		}
	].filter((item) => !!item);
</script>

<svelte:head>
	<title>{formattedTitle}</title>
	<link rel="icon" href="/favicon.ico" />
	<link rel="manifest" href="/manifest.json" />

	<script
		defer
		data-domain="kinegram.app"
		src="https://plausible.io/js/script.tagged-events.js"
	></script>

	{#each defaultMeta as tag}
		<meta {...tag} />
	{/each}
</svelte:head>
