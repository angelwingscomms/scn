import { bucket } from '$lib/server/auth';
import { list_posts } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	event.setHeaders({ 'cache-control': 'private, no-store' });
	return { l: (await list_posts(bucket(event))).slice(0, 54) }; // recent publications
};
