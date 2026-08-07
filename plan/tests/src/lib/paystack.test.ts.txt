import { afterEach, describe, expect, it, vi } from 'vitest';
import { meta_item, paystack_init, paystack_verify } from './paystack';
import { get_secret } from './secret';

const ok = (data: unknown) =>
	Promise.resolve(
		new Response(JSON.stringify({ status: true, data }), {
			status: 200,
			headers: { 'content-type': 'application/json' }
		})
	);

afterEach(() => vi.unstubAllGlobals());

describe('get_secret', () => {
	it('passes a plain string binding straight through', async () => {
		await expect(get_secret('sk_test_abc')).resolves.toBe('sk_test_abc');
	});

	it('awaits a secrets-store binding', async () => {
		await expect(get_secret({ get: async () => 'sk_live_xyz' })).resolves.toBe('sk_live_xyz');
	});

	it('never throws on a missing binding', async () => {
		await expect(get_secret(undefined)).resolves.toBe('');
		await expect(get_secret('')).resolves.toBe('');
	});
});

describe('paystack_init', () => {
	it('sends the amount in kobo with our own reference and callback', async () => {
		const fetch_ = vi.fn((..._a: unknown[]) =>
			ok({ authorization_url: 'https://pay/x', access_code: 'AC1', reference: 'scn_1' })
		);
		vi.stubGlobal('fetch', fetch_);

		const r = await paystack_init('sk_test_k', 'buyer@mail.com', 250000, 'scn_1', 'https://s/r', {
			i: 'waec'
		});

		expect(r.access_code).toBe('AC1');
		const [url, init] = fetch_.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.paystack.co/transaction/initialize');
		expect(init.method).toBe('POST');
		expect((init.headers as Record<string, string>).Authorization).toBe('Bearer sk_test_k');
		const sent = JSON.parse(init.body as string);
		expect(sent.amount).toBe(250000);
		expect(sent.email).toBe('buyer@mail.com');
		expect(sent.reference).toBe('scn_1');
		expect(sent.callback_url).toBe('https://s/r');
		expect(JSON.parse(sent.metadata)).toEqual({ i: 'waec' });
	});

	it('throws when paystack refuses', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() =>
				Promise.resolve(
					new Response(JSON.stringify({ status: false, message: 'bad key' }), { status: 401 })
				)
			)
		);
		await expect(
			paystack_init('sk_bad', 'b@m.com', 100, 'r', 'https://s/r', {})
		).rejects.toThrow();
	});
});

describe('paystack_verify', () => {
	it('asks about the escaped reference and returns the transaction', async () => {
		const fetch_ = vi.fn((..._a: unknown[]) =>
			ok({
				status: 'success',
				reference: 'scn a',
				amount: 250000,
				customer: { email: 'b@m.com' },
				metadata: { i: 'waec' }
			})
		);
		vi.stubGlobal('fetch', fetch_);

		const v = await paystack_verify('sk_test_k', 'scn a');

		expect(v.status).toBe('success');
		expect(v.amount).toBe(250000);
		expect(fetch_.mock.calls[0][0]).toBe('https://api.paystack.co/transaction/verify/scn%20a');
	});

	it('throws when the transaction cannot be read', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.resolve(new Response('nope', { status: 500 })))
		);
		await expect(paystack_verify('sk_test_k', 'scn_1')).rejects.toThrow();
	});
});

describe('meta_item', () => {
	it('reads the item id back whether paystack echoes an object or a string', () => {
		expect(meta_item({ i: 'waec' })).toBe('waec');
		expect(meta_item('{"i":"bundle-all"}')).toBe('bundle-all');
	});

	it('returns empty for anything it cannot read', () => {
		expect(meta_item(null)).toBe('');
		expect(meta_item('not json')).toBe('');
		expect(meta_item({ nope: 1 })).toBe('');
		expect(meta_item({ i: 7 })).toBe('');
	});
});
