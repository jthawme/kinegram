import { sveltekit } from '@sveltejs/kit/vite';
import { TransformServer } from 'jt-factory/vite';
import svg from '@poppanator/sveltekit-svg';
import { defineConfig } from 'vite';
import BuildManifest from './tools/BuildManifest.js';

export default defineConfig({
	plugins: [
		sveltekit(),
		TransformServer(),
		svg({
			includePaths: ['./src/lib/icons/'],
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: 'preset-default',
						// by default svgo removes the viewBox which prevents svg icons from scaling
						// not a good idea! https://github.com/svg/svgo/pull/1461
						params: { overrides: { removeViewBox: false } }
					},
					{
						name: 'convertColors',
						params: {
							currentColor: true
						}
					},
					{ name: 'removeAttrs', params: { attrs: '(width|height)' } }
				]
			}
		}),
		BuildManifest({
			manifest: {
				name: 'Svelte Template'
			}
		})
	],

	css: {
		preprocessorOptions: {
			hoistUseStatements: true,
			scss: {
				additionalData: (content) => {
					const imports = `@import "$lib/styles/common.scss";`;
					// If there are @use statements, insert the import after the last one,
					// otherwise insert it before all content.
					const match = content.match(/@use '[^']+';/g);
					if (match) {
						const last = match[match.length - 1];
						return content.replace(last, `${last}\n${imports}`);
					} else {
						return `${imports}\n${content}`;
					}
				}
			}
		}
	}
});
