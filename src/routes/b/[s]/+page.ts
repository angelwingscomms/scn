import { error } from '@sveltejs/kit';
import { book, books } from '$lib/catalog';
import type { PageLoad } from './$types';

export const prerender = true;

export const entries = () => books.map((b) => ({ s: b.i }));

export const load: PageLoad = ({ params }) => {
	const b = book(params.s);
	if (!b) error(404, 'no such book');
	return { b };
};