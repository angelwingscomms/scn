import { env } from '$env/dynamic/private';
import { book, item } from '$lib/catalog';
import { meta_item, paystack_verify } from '$lib/paystack';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, setHeaders }) => {
	setHeaders({ 'cache-control': 'private, no-store' });

	const r = url.searchParams.get('reference') ?? url.searchParams.get('trxref') ?? '';
	if (!r) return { o: null, m: 'this link carries no payment reference.' };

	const v = await paystack_verify(env.PAYSTACK_SECRET_KEY, r).catch(() => null);
	if (!v) return { o: null, m: 'we could not reach paystack to confirm this payment.' };
	if (v.status !== 'success') return { o: null, m: `paystack reports this payment as "${v.status}".` };

	const got = item(meta_item(v.metadata));
	if (!got) return { o: null, m: 'we cannot tell which books this payment was for.' };

	return {
		o: {
			r,
			e: v.customer.email,
			t: got.t,
			f: got.f.map((i) => ({ i, t: book(i)!.t }))
		},
		m: ''
	};
};