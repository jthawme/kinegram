import { findFile, run } from 'jt-factory';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	const { slug } = params;

	const file = await findFile(`${slug}.md`);

	if (file) {
		const data = await run(file);
		return data;
	}

	return {};
}
