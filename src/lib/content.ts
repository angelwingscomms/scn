export const kinds = { t: 'short post', b: 'article', v: 'video', n: 'announcement' };
export type Kind = keyof typeof kinds;
export type Post = {
	i: string; // id
	k: Kind; // kind
	t: string; // title
	s: string; // summary
	b: string; // body, plain text
	v: string; // video id
	c: string; // video transcript
	d: 'd' | 'p'; // draft or published
	p: number; // first publication time
	u: number; // updated time
	e: string; // revision etag
};
export type Summary = Pick<Post, 'i' | 'k' | 't' | 's' | 'd' | 'p' | 'u'>;
export const valid_id = (id: string) => /^[a-f0-9-]{36}$/.test(id);
export const media_limit = 27 * 1024 * 1024;
export const date_label = (time: number) => new Date(time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function parse_post(data: FormData): Omit<Post, 'p' | 'u'> {
	const field = (key: string) => String(data.get(key) ?? '').trim();
	if (!valid_id(field('i'))) throw new Error('invalid post id');
	if (!Object.hasOwn(kinds, field('k'))) throw new Error('choose a post type');
	if (!['d', 'p'].includes(field('d'))) throw new Error('invalid publication state');
	if (!field('t') || field('t').length > 180) throw new Error('enter a title of 180 characters or fewer');
	if (field('s').length > 300) throw new Error('keep the summary under 300 characters');
	if (field('b').length > (field('k') === 'b' ? 50000 : 1800)) throw new Error(field('k') === 'b' ? 'article is too long' : 'keep short posts under 1800 characters');
	if (field('c').length > 50000) throw new Error('transcript is too long');
	if (field('v') && !valid_id(field('v'))) throw new Error('invalid video');
	if (field('d') === 'p' && field('k') === 'v' && !field('v')) throw new Error('upload a video before publishing');
	if (field('d') === 'p' && field('k') !== 'v' && !field('b')) throw new Error('write your post before publishing');
	return { i: field('i'), k: field('k') as Kind, t: field('t'), s: field('s'), b: field('b'), v: field('k') === 'v' ? field('v') : '', c: field('k') === 'v' ? field('c') : '', d: field('d') as Post['d'], e: field('e') };
}
