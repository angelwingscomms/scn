import { bucket } from '$lib/server/auth';
import { list_posts } from '$lib/server/content';
import type { RequestHandler } from './$types';

const xml = (value: string) => value.replace(/[<>&"']/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!);
export const GET: RequestHandler = async (event) => {
	const posts = (await list_posts(bucket(event))).slice(0, 54);
	return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>michael kekong · from the desk</title><link>https://kekong.me/updates</link><description>Short posts, articles, videos and announcements from Michael Kekong.</description><language>en</language>${posts.map((post) => `<item><title>${xml(post.t)}</title><link>https://kekong.me/updates/${post.i}</link><guid>https://kekong.me/updates/${post.i}</guid><description>${xml(post.s)}</description><pubDate>${new Date(post.p).toUTCString()}</pubDate></item>`).join('')}</channel></rss>`, { headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'cache-control': 'no-store' } });
};
