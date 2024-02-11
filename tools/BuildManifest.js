// @ts-nocheck
import sharp from 'sharp';
import fs from 'fs-extra';
import path from 'path';
import ico from 'sharp-ico';

const DEFAULT_MANIFEST = async () => {
	const pkg = await import('../package.json');

	return {
		name: pkg.name,
		short_name: pkg.name,
		start_url: '.',
		display: 'standalone',
		background_color: '#fff',
		description: pkg.default?.description ?? ''
	};
};

const ICON_SIZES = [48, 72, 96, 144, 168, 192];

function generateIco(sharpNode, iconName = 'favicon.ico', sizes = [128, 64, 32, 24]) {
	return ico.sharpsToIco([sharpNode], iconName, {
		sizes
	});
}

export default function manifestPlugin({
	icon = 'favicon.png',
	outputDir = 'icons',
	outputIco = 'favicon.ico',
	faviconSizes = [128, 64, 32, 24],
	manifestIconSizes = ICON_SIZES,
	manifest = {}
} = {}) {
	let viteConfig;

	return {
		name: 'build-manifest', // required, will show up in warnings and errors

		configResolved(config) {
			viteConfig = config;
		},

		async buildStart() {
			const defaultManifest = await DEFAULT_MANIFEST();

			if (fs.existsSync(path.join(viteConfig.publicDir, icon))) {
				fs.ensureDirSync(path.join(viteConfig.publicDir, outputDir));

				const iconNode = sharp(path.join(viteConfig.publicDir, icon));

				console.log(`Generating .ico file`);
				await generateIco(iconNode, path.join(viteConfig.publicDir, outputIco), faviconSizes);

				console.log(`Generating icons`);
				await Promise.all(
					manifestIconSizes.map((size) =>
						iconNode
							.toFormat('png')
							.resize(size, size)
							.toFile(
								path.join(viteConfig.publicDir, outputDir, [size, path.basename(icon)].join('.'))
							)
					)
				);

				const finalManifest = {
					...defaultManifest,
					...manifest,
					icons: manifestIconSizes.map((size) => ({
						sizes: `${size}x${size}`,
						type: `image/png`,
						src: `/${path.join(outputDir, [size, path.basename(icon)].join('.'))}`
					}))
				};

				console.log(`Writing manifest file`);
				fs.writeFileSync(
					path.join(viteConfig.publicDir, 'manifest.json'),
					JSON.stringify(finalManifest, null, 2),
					'utf-8'
				);
			}
		}
	};
}
