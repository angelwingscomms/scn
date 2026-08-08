import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { book, item } from '$lib/catalog';
import { meta_item, paystack_verify } from '$lib/paystack';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, platform }) => {
	const b = book(params.f);
	if (!b) error(404, 'no such book');

	const v = await paystack_verify(env.PAYSTACK_SECRET_KEY, params.r).catch(() => null);
	if (!v) error(502, 'could not confirm the payment');
	if (v.status !== 'success') error(403, 'this payment is not complete');
	if (!item(meta_item(v.metadata))?.f.includes(b.i)) {
		error(403, 'this payment does not include that book');
	}

	const object = await platform?.env.F.get(`${b.i}.pdf`);
	if (!object) error(404, 'that file is missing — message us on whatsapp');

	return new Response(object.body, {
		headers: {
			'content-type': 'application/pdf',
			'content-disposition': `attachment; filename="${b.i}.pdf"`,
			'cache-control': 'private, no-store'
		}
	});
};