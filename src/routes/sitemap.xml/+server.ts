import { books } from '$lib/catalog';
import type { RequestHandler } from './$types';
import { bucket } from '$lib/server/auth';
import { list_posts } from '$lib/server/content';

export const prerender = false;

const SITE = 'https://kekong.me';

export const GET: RequestHandler = async (event) => {
	const urls = ['', '/updates', ...books.map((b) => `/b/${b.i}`), ...(await list_posts(bucket(event))).map((post) => `/updates/${post.i}`)]
		.map((p) => `<url><loc>${SITE}${p}</loc><changefreq>monthly</changefreq></url>`)
		.join('');

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
		{ headers: { 'content-type': 'application/xml' } }
	);
};
