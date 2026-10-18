import { json } from '@sveltejs/kit';
import { bucket, require_owner } from '$lib/server/auth';
import { get_post } from '$lib/server/content';
import { delivery_state, push_ready, send_batch } from '$lib/server/push';
import { same_origin } from '$lib/server/http';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	await require_owner(event);
	const post = await get_post(bucket(event), event.params.i, true);
	return json({ r: push_ready(), d: await delivery_state(bucket(event), post.i) }, { headers: { 'cache-control': 'private, no-store' } });
};
export const POST: RequestHandler = async (event) => {
	same_origin(event); await require_owner(event);
	const post = await get_post(bucket(event), event.params.i);
	return json({ d: await send_batch(bucket(event), post, event.url.searchParams.get('retry') === '1') }, { headers: { 'cache-control': 'private, no-store' } });
};
