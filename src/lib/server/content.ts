import { error } from '@sveltejs/kit';
import type { R2Bucket } from '@cloudflare/workers-types';
import { parse_post, valid_id, type Post, type Summary } from '$lib/content';

const post_key = (id: string) => `journal/posts/${id}.json`;
export const media_key = (id: string) => `journal/media/${id}`;

export async function get_post(store: R2Bucket, id: string, private_access = false): Promise<Post> {
	if (!valid_id(id)) error(404, 'post not found');
	const object = await store.get(post_key(id));
	if (!object) error(404, 'post not found');
	const post = await object.json<Post & { x?: boolean }>();
	if (post.x) error(404, 'post not found');
	if (post.d !== 'p' && !private_access) error(404, 'post not found');
	return { ...post, e: object.etag };
}

export async function list_posts(store: R2Bucket, private_access = false): Promise<Summary[]> {
	const posts: Summary[] = [];
	let cursor: string | undefined;
	do {
		const page = await store.list({ prefix: 'journal/posts/', include: ['customMetadata'], cursor });
		for (const object of page.objects) {
			if (!object.customMetadata?.j) continue;
			const summary: Summary = JSON.parse(object.customMetadata.j);
			if (summary.d === 'p' || private_access) posts.push(summary);
		}
		cursor = page.truncated ? page.cursor : undefined;
	} while (cursor);
	return posts.sort((a, b) => (b.p || b.u) - (a.p || a.u) || b.i.localeCompare(a.i));
}

export async function save_post(store: R2Bucket, data: FormData) {
	let parsed: ReturnType<typeof parse_post>;
	try { parsed = parse_post(data); } catch (cause) { error(400, (cause as Error).message); }
	const existing = await store.get(post_key(parsed.i));
	if (existing && parsed.e !== existing.etag || !existing && parsed.e) error(409, 'this post changed in another tab — reload before saving');
	const previous = existing ? await existing.json<Post & { x?: boolean }>() : null;
	if (previous?.x) error(410, 'this post has been deleted');
	if (parsed.v) {
		const media = await store.head(media_key(parsed.v));
		if (media?.customMetadata?.i !== parsed.i) error(400, 'upload a video for this post');
	}
	const post: Post = { ...parsed, p: previous?.p || (parsed.d === 'p' ? Date.now() : 0), u: Date.now(), e: '' };
	const { i, k, t, s, d, p, u } = post;
	const written = await store.put(post_key(i), JSON.stringify(post), {
		onlyIf: existing ? { etagMatches: existing.etag } : { etagDoesNotMatch: '*' },
		customMetadata: { j: JSON.stringify({ i, k, t, s, d, p, u }) },
		httpMetadata: { contentType: 'application/json' }
	});
	if (!written) error(409, 'this post changed in another tab — reload before saving');
	return { ...post, e: written.etag };
}

export async function delete_post(store: R2Bucket, id: string, etag: string) {
	const post = await get_post(store, id, true);
	if (!etag || post.e !== etag) error(409, 'this post changed — reload before deleting');
	// A conditional tombstone closes the race between the revision check and deletion.
	const written = await store.put(post_key(id), JSON.stringify({ ...post, d: 'd', x: true }), { onlyIf: { etagMatches: etag } });
	if (!written) error(409, 'this post changed — reload before deleting');
	// Retain the private tombstone so a delayed writer cannot recreate a deleted public post.
	if (post.v) await store.delete(media_key(post.v));
}

export function video_type(bytes: Uint8Array, claimed: string) {
	if (claimed === 'video/mp4' && bytes.length >= 12 && new TextDecoder().decode(bytes.slice(4, 8)) === 'ftyp') return claimed;
	if (claimed === 'video/webm' && bytes[0] === 0x1a && bytes[1] === 0x45 && bytes[2] === 0xdf && bytes[3] === 0xa3) return claimed;
	error(415, 'upload an mp4 or webm video');
}

export async function serve_media(store: R2Bucket, id: string, request: Request, private_access: boolean) {
	if (!valid_id(id)) error(404, 'video not found');
	const metadata = await store.head(media_key(id));
	if (!metadata?.customMetadata?.i) error(404, 'video not found');
	const post = await get_post(store, metadata.customMetadata.i, private_access);
	if (post.v !== id && !private_access) error(404, 'video not found');
	const headers = new Headers({ 'content-type': metadata.httpMetadata?.contentType ?? 'video/mp4', 'accept-ranges': 'bytes', 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' });
	let offset = 0;
	let length = metadata.size;
	const range = request.headers.get('range');
	if (range) {
		const match = /^bytes=(\d*)-(\d*)$/.exec(range);
		if (!match || !match[1] && !match[2]) return new Response(null, { status: 416, headers: { 'content-range': `bytes */${metadata.size}` } });
		if (!match[1]) { length = Math.min(Number(match[2]), metadata.size); offset = metadata.size - length; }
		else { offset = Number(match[1]); length = (match[2] ? Math.min(Number(match[2]), metadata.size - 1) : metadata.size - 1) - offset + 1; }
		if (!Number.isSafeInteger(offset) || offset < 0 || offset >= metadata.size || length <= 0) return new Response(null, { status: 416, headers: { 'content-range': `bytes */${metadata.size}` } });
		headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${metadata.size}`);
	}
	headers.set('content-length', String(length));
	if (request.method === 'HEAD') return new Response(null, { status: range ? 206 : 200, headers });
	const object = await store.get(media_key(id), { range: { offset, length } });
	if (!object) error(404, 'video not found');
	return new Response(object.body as unknown as ReadableStream, { status: range ? 206 : 200, headers });
}
