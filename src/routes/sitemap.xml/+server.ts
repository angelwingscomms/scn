import { books } from '$lib/catalog';
import type { RequestHandler } from './$types';

export const prerender = true;

const SITE = 'https://kekongknowledge.apexlinks.org';

export const GET: RequestHandler = () => {
	const urls = ['', ...books.map((b) => `/b/${b.i}`)]
		.map((p) => `<url><loc>${SITE}${p}</loc><changefreq>monthly</changefreq></url>`)
		.join('');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
		{ headers: { 'content-type': 'application/xml' } }
	);
};