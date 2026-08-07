import { get_secret, type SecretVal } from '$lib/secret';

const BASE = 'https://api.paystack.co';

export type InitResult = {
	authorization_url: string;
	access_code: string;
	reference: string;
};

export type VerifyResult = {
	status: string;
	reference: string;
	amount: number;
	customer: { email: string };
	metadata: unknown;
};

export async function paystack_init(
	key: SecretVal,
	email: string,
	amount_kobo: number,
	reference: string,
	callback_url: string,
	metadata: Record<string, unknown>
): Promise<InitResult> {
	const res = await fetch(`${BASE}/transaction/initialize`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${await get_secret(key)}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			email,
			amount: amount_kobo,
			reference,
			callback_url,
			metadata: JSON.stringify(metadata)
		})
	});
	const body = await res.json().catch(() => null);
	if (!res.ok || !body?.status) throw new Error(`paystack init failed: ${body?.message ?? res.status}`);
	return body.data as InitResult;
}

export async function paystack_verify(key: SecretVal, reference: string): Promise<VerifyResult> {
	const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
		headers: {
			Authorization: `Bearer ${await get_secret(key)}`,
			'Content-Type': 'application/json'
		}
	});
	const body = await res.json().catch(() => null);
	if (!res.ok || !body?.status) throw new Error(`paystack verify failed: ${body?.message ?? res.status}`);
	return body.data as VerifyResult;
}

export function meta_item(m: unknown): string {
	const o = typeof m === 'string' ? safe_parse(m) : m;
	if (!o || typeof o !== 'object') return '';
	const i = (o as Record<string, unknown>).i;
	return typeof i === 'string' ? i : '';
}

function safe_parse(s: string): unknown {
	try {
		return JSON.parse(s);
	} catch {
		return null;
	}
}