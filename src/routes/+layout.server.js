import { getManifest } from 'jt-factory';

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	const pages = await getManifest('*', { expand: true });
	return {
		pages
	};
}
