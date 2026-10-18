import { json } from '@sveltejs/kit';
import { bucket } from '$lib/server/auth';
import { parse_subscription, push_public_key, push_ready, sub_key } from '$lib/server/push';
import { read_limited, same_origin } from '$lib/server/http';
import type { RequestHandler } from './$types';

const device_cookie = 'scn_push';
export const GET: RequestHandler = async (event) => {
	let device = event.cookies.get(device_cookie);
	if (!device || !/^[a-f0-9-]{36}$/.test(device)) {
		device = crypto.randomUUID();
		event.cookies.set(device_cookie, device, { path: '/', httpOnly: true, secure: event.url.protocol === 'https:', sameSite: 'strict', maxAge: 365 * 86400 });
	}
	return json({ k: push_public_key(), s: Boolean(await bucket(event).head(sub_key(device))) }, { headers: { 'cache-control': 'private, no-store' } });
};
export const POST: RequestHandler = async (event) => {
	same_origin(event);
	if (!push_ready()) return json({ m: 'browser notifications are not configured yet' }, { status: 503 });
	const device = event.cookies.get(device_cookie);
	if (!device || !/^[a-f0-9-]{36}$/.test(device)) return json({ m: 'reload the page before enabling notifications' }, { status: 400 });
	let input: unknown;
	try { input = JSON.parse(new TextDecoder().decode(await read_limited(event.request, 4096))); } catch { return json({ m: 'invalid subscription' }, { status: 400 }); }
	const subscription = await parse_subscription(input);
	await bucket(event).put(sub_key(device), JSON.stringify(subscription), { httpMetadata: { contentType: 'application/json' } });
	return json({ s: true }, { headers: { 'cache-control': 'private, no-store' } });
};
export const DELETE: RequestHandler = async (event) => {
	same_origin(event);
	const device = event.cookies.get(device_cookie);
	if (device && /^[a-f0-9-]{36}$/.test(device)) await bucket(event).delete(sub_key(device));
	return json({ s: false }, { headers: { 'cache-control': 'private, no-store' } });
};
