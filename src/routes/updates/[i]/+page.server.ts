import { bucket, owner } from '$lib/server/auth';
import { get_post } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	event.setHeaders({ 'cache-control': 'private, no-store' });
	const post = await get_post(bucket(event), event.params.i, await owner(event));
	if (post.d === 'd') event.setHeaders({ 'x-robots-tag': 'noindex, nofollow' });
	return { p: post }; // post
};
