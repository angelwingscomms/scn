import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import { buildPushPayload, type PushSubscription } from '@block65/webcrypto-web-push';
import type { Post } from '$lib/content';
import type { R2Bucket } from '@cloudflare/workers-types';

export const push_ready = () => Boolean(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY);
export const push_public_key = () => push_ready() ? env.VAPID_PUBLIC_KEY : '';
export const sub_key = (device: string) => `journal/subs/${device}.json`;
export type Delivery = {
	c: string; // subscription cursor
	d: boolean; // complete
	s: number; // successful deliveries
	f: number; // failed deliveries
	t: number; // lease expiry
	b: number; // broadcast started at
};

export async function parse_subscription(input: unknown): Promise<PushSubscription> {
	if (!input || typeof input !== 'object') error(400, 'invalid subscription');
	const value = input as Partial<PushSubscription>;
	try {
		const url = new URL(value.endpoint!);
		const host = url.hostname;
		if (url.protocol !== 'https:' || url.port || url.username || url.password || !(host === 'fcm.googleapis.com' || host === 'updates.push.services.mozilla.com' || host.endsWith('.notify.windows.com') || host === 'web.push.apple.com' || host.endsWith('.push.apple.com'))) throw new Error();
		if (value.endpoint!.length > 2048 || !value.keys || !/^[A-Za-z0-9_-]+={0,2}$/.test(value.keys.p256dh) || !/^[A-Za-z0-9_-]+={0,2}$/.test(value.keys.auth)) throw new Error();
		const decode = (text: string) => Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), (character) => character.charCodeAt(0));
		const point = decode(value.keys.p256dh);
		if (point.length !== 65 || point[0] !== 4 || decode(value.keys.auth).length !== 16) throw new Error();
		await crypto.subtle.importKey('raw', point, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
		return { endpoint: url.href, expirationTime: null, keys: { p256dh: value.keys.p256dh, auth: value.keys.auth } };
	} catch { error(400, 'invalid browser push endpoint or keys'); }
}

export async function delivery_state(store: R2Bucket, post_id: string) {
	return (await store.get(`journal/delivery/${post_id}.json`))?.json<Delivery>() ?? null;
}

export async function send_batch(store: R2Bucket, post: Post, retry: boolean) {
	if (!push_ready()) error(503, 'browser push needs VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY');
	if (post.d !== 'p') error(400, 'publish the post before notifying followers');
	const key = `journal/delivery/${post.i}.json`;
	const stored = await store.get(key);
	let state: Delivery = stored ? await stored.json<Delivery>() : { c: '', d: false, s: 0, f: 0, t: 0, b: Date.now() };
	if (state.t > Date.now()) error(409, 'notification delivery is already running — try again shortly');
	if (state.d && (!retry || !state.f)) return state;
	if (state.d && retry) state = { c: '', d: false, s: 0, f: 0, t: 0, b: Date.now() };
	state.t = Date.now() + 120000;
	const claimed = await store.put(key, JSON.stringify(state), { onlyIf: stored ? { etagMatches: stored.etag } : { etagDoesNotMatch: '*' } });
	if (!claimed) error(409, 'notification delivery is already running');
	try {
		const page = await store.list({ prefix: 'journal/subs/', cursor: state.c || undefined, limit: 9 });
		const results = await Promise.all(page.objects.map(async (object) => {
			if (object.uploaded.getTime() > state.b) return 'skip';
			try {
				const stored_sub = await store.get(object.key);
				if (!stored_sub) return 'skip';
				const sub = await parse_subscription(await stored_sub.json());
				const payload = await buildPushPayload({ data: JSON.stringify({ t: post.t, b: post.s || post.b.slice(0, 180), u: `/updates/${post.i}`, i: post.i }), options: { ttl: 86400 } }, sub, { subject: 'https://kekong.me', publicKey: env.VAPID_PUBLIC_KEY!, privateKey: env.VAPID_PRIVATE_KEY! });
				const response = await fetch(sub.endpoint, { ...payload, redirect: 'error', signal: AbortSignal.timeout(8000) });
				await response.body?.cancel();
				if (response.status === 404 || response.status === 410) { await store.delete(object.key); return 'skip'; }
				return response.ok ? 'sent' : 'failed';
			} catch { return 'failed'; }
		}));
		state.s += results.filter((result) => result === 'sent').length;
		state.f += results.filter((result) => result === 'failed').length;
		state.c = page.truncated ? page.cursor : '';
		state.d = !page.truncated;
		state.t = 0;
		if (!await store.put(key, JSON.stringify(state), { onlyIf: { etagMatches: claimed.etag } })) error(409, 'delivery progress changed — reload before continuing');
		return state;
	} catch (cause) {
		await store.put(key, JSON.stringify({ ...state, t: 0 }), { onlyIf: { etagMatches: claimed.etag } });
		throw cause;
	}
}
