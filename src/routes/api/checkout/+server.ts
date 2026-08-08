import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { item } from '$lib/catalog';
import { paystack_init } from '$lib/paystack';

const mail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const POST: RequestHandler = async ({ request, url }) => {
	const body = await request.json().catch(() => null);
	const e = typeof body?.e === 'string' ? body.e.trim().toLowerCase() : '';
	const i = typeof body?.i === 'string' ? body.i : '';

	if (!mail.test(e)) return json({ m: 'enter a valid email' }, { status: 400 });
	const picked = item(i);
	if (!picked) return json({ m: 'that item does not exist' }, { status: 400 });

	try {
		const r = await paystack_init(
			env.PAYSTACK_SECRET_KEY,
			e,
			picked.a,
			`scn_${crypto.randomUUID().replaceAll('-', '')}`,
			`${url.origin}/r`,
			{ i }
		);
		return json({ u: r.authorization_url, k: r.access_code, r: r.reference });
	} catch {
		return json({ m: 'payment could not be started' }, { status: 502 });
	}
};