import { json } from '@sveltejs/kit';
import { bucket, require_owner } from '$lib/server/auth';
import { get_post, media_key, video_type } from '$lib/server/content';
import { read_limited, same_origin } from '$lib/server/http';
import { media_limit } from '$lib/content';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	same_origin(event); await require_owner(event);
	const post = await get_post(bucket(event), event.url.searchParams.get('i') ?? '', true);
	const bytes = await read_limited(event.request, media_limit);
	const type = video_type(bytes, event.request.headers.get('content-type') ?? '');
	const id = crypto.randomUUID();
	await bucket(event).put(media_key(id), bytes, { customMetadata: { i: post.i }, httpMetadata: { contentType: type } });
	return json({ i: id }, { status: 201, headers: { 'cache-control': 'private, no-store' } });
};
