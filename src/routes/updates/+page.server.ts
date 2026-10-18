import { error } from '@sveltejs/kit';
import { bucket } from '$lib/server/auth';
import { list_posts } from '$lib/server/content';
import { kinds } from '$lib/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	event.setHeaders({ 'cache-control': 'no-store' });
	const kind = event.url.searchParams.get('k') ?? '';
	if (kind && !Object.hasOwn(kinds, kind)) error(400, 'unknown post type');
	const page = Number(event.url.searchParams.get('p') ?? 1);
	if (!Number.isSafeInteger(page) || page < 1) error(400, 'invalid page');
	const posts = (await list_posts(bucket(event))).filter((post) => !kind || post.k === kind);
	return { l: posts.slice((page - 1) * 18, page * 18), p: page, n: Math.max(1, Math.ceil(posts.length / 18)), k: kind }; // posts, page, page count, kind
};
