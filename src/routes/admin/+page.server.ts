import { fail, isHttpError, redirect, type RequestEvent } from '@sveltejs/kit';
import { auth_ready, bucket, login, logout, owner, require_owner } from '$lib/server/auth';
import { delete_post, get_post, list_posts, save_post } from '$lib/server/content';
import { read_limited, same_origin } from '$lib/server/http';
import type { Post } from '$lib/content';
import type { Actions, PageServerLoad } from './$types';

async function form_data(event: RequestEvent) {
	return new Request(event.url, { method: 'POST', headers: { 'content-type': event.request.headers.get('content-type') ?? '' }, body: await read_limited(event.request, 1024 * 1024) }).formData();
}
function failure(cause: unknown, post?: Post) {
	if (isHttpError(cause)) return fail(cause.status, { m: cause.body.message, p: post });
	console.error('publishing operation failed', cause);
	return fail(503, { m: 'could not save changes — please try again', p: post });
}
export const load: PageServerLoad = async (event) => {
	event.setHeaders({ 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' });
	if (!await owner(event)) return { o: false, r: auth_ready(), l: [], p: null };
	return {
		o: true, // owner
		r: true, // owner access configured
		l: await list_posts(bucket(event), true), // posts
		p: event.url.searchParams.get('i') ? await get_post(bucket(event), event.url.searchParams.get('i')!, true) : { i: crypto.randomUUID(), k: 't', t: '', s: '', b: '', c: '', v: '', d: 'd', p: 0, u: 0, e: '' } as Post // editor
	};
};
export const actions: Actions = {
	login: async (event) => {
		same_origin(event);
		try {
			if (!await login(event, String((await form_data(event)).get('p') ?? ''))) return fail(401, { m: 'incorrect password' });
		} catch (cause) { return failure(cause); }
		redirect(303, '/admin');
	},
	logout: async (event) => { same_origin(event); logout(event); redirect(303, '/admin'); },
	save: async (event) => {
		same_origin(event); await require_owner(event);
		let submitted: Post | undefined;
		let saved: Post;
		try {
			const data = await form_data(event);
			submitted = Object.fromEntries(['i', 'k', 't', 's', 'b', 'v', 'c', 'd', 'e'].map((key) => [key, String(data.get(key) ?? '')])) as unknown as Post;
			saved = await save_post(bucket(event), data);
		} catch (cause) { return failure(cause, submitted); }
		redirect(303, `/admin?i=${saved.i}&saved=1`);
	},
	remove: async (event) => {
		same_origin(event); await require_owner(event);
		try { const data = await form_data(event); await delete_post(bucket(event), String(data.get('i') ?? ''), String(data.get('e') ?? '')); }
		catch (cause) { return failure(cause); }
		redirect(303, '/admin?removed=1');
	}
};
