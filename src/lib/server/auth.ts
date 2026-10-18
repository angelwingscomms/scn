import { env } from '$env/dynamic/private';
import { error, type RequestEvent } from '@sveltejs/kit';
import type { R2Bucket } from '@cloudflare/workers-types';

const encoder = new TextEncoder();
const lifetime = 7 * 86400;
const session_name = 'scn_owner';

export const auth_ready = () => (env.ADMIN_PASSWORD?.length ?? 0) >= 10;
export function bucket(event: Pick<RequestEvent, 'platform'>) {
	if (!event.platform?.env.F) error(503, 'storage is unavailable');
	return event.platform.env.F as R2Bucket;
}
export async function digest(value: string) {
	return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value))), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
async function signing_key() {
	return crypto.subtle.importKey('raw', encoder.encode(env.ADMIN_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
export async function sign(value: string) {
	return btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', await signing_key(), encoder.encode(value)))));
}
export async function owner(event: Pick<RequestEvent, 'cookies'>) {
	if (!auth_ready()) return false;
	const [expires, signature] = (event.cookies.get(session_name) ?? '').split('.');
	const now = Math.floor(Date.now() / 1000);
	if (!signature || !/^\d+$/.test(expires) || +expires <= now || +expires > now + lifetime) return false;
	try {
		return await crypto.subtle.verify('HMAC', await signing_key(), Uint8Array.from(atob(signature), (char) => char.charCodeAt(0)), encoder.encode(`owner:${expires}`));
	} catch { return false; }
}
export async function require_owner(event: RequestEvent) {
	if (!await owner(event)) error(401, 'sign in to continue');
}
export async function login(event: RequestEvent, password: string) {
	if (!auth_ready()) error(503, 'owner access needs an ADMIN_PASSWORD of at least 10 characters');
	const key = `journal/attempts/${await digest(`${env.ADMIN_PASSWORD}:${event.getClientAddress()}`)}`;
	let claimed = false;
	for (let attempt = 0; attempt < 4; attempt++) {
		const stored = await bucket(event).get(key);
		const record = stored ? await stored.json<{ n: number; t: number }>() : { n: 0, t: Date.now() };
		if (Date.now() - record.t > 15 * 60000) { record.n = 0; record.t = Date.now(); }
		if (record.n >= 9) error(429, 'too many attempts — try again in 15 minutes');
		if (await bucket(event).put(key, JSON.stringify({ n: record.n + 1, t: record.t }), { onlyIf: stored ? { etagMatches: stored.etag } : { etagDoesNotMatch: '*' } })) { claimed = true; break; }
	}
	if (!claimed) error(429, 'another sign-in is running — try again');
	const [actual, expected] = await Promise.all([digest(password), digest(env.ADMIN_PASSWORD!)]);
	let difference = 0;
	for (let index = 0; index < actual.length; index++) difference |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
	if (difference) return false;
	const expires = String(Math.floor(Date.now() / 1000) + lifetime);
	event.cookies.set(session_name, `${expires}.${await sign(`owner:${expires}`)}`, { path: '/', httpOnly: true, secure: event.url.protocol === 'https:', sameSite: 'strict', maxAge: lifetime });
	return true;
}
export function logout(event: Pick<RequestEvent, 'cookies'>) { event.cookies.delete(session_name, { path: '/' }); }
