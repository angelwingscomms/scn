import { describe, expect, it } from 'vitest';
import {
	books,
	bundles,
	by_cat,
	book,
	bundle,
	cats,
	item,
	list_price,
	naira
} from './catalog';

describe('books', () => {
	it('holds exactly the eight titles', () => {
		expect(books).toHaveLength(8);
	});

	it('has unique slugs', () => {
		expect(new Set(books.map((b) => b.i)).size).toBe(8);
	});

	it('carries every field the pages render', () => {
		for (const b of books) {
			expect(b.i, `${b.i} slug`).toMatch(/^[a-z0-9-]+$/);
			expect(b.t.length, `${b.i} title`).toBeGreaterThan(2);
			expect(b.s.length, `${b.i} subtitle`).toBeGreaterThan(10);
			expect(b.h.length, `${b.i} hook`).toBeGreaterThan(10);
			expect(b.d.length, `${b.i} pitch`).toBeGreaterThan(40);
			expect(b.w.length, `${b.i} who-for`).toBeGreaterThan(10);
			expect(b.l.length, `${b.i} contents`).toBeGreaterThanOrEqual(4);
			expect(b.p, `${b.i} pages`).toBeGreaterThan(0);
			expect(Object.keys(cats), `${b.i} category`).toContain(b.c);
		}
	});

	it('prices everything in whole naira, held as kobo', () => {
		for (const b of books) {
			expect(b.a, `${b.i} price`).toBeGreaterThan(0);
			expect(b.a % 100, `${b.i} is kobo`).toBe(0);
		}
	});

	it('covers all three shelves', () => {
		expect(by_cat('b').length + by_cat('m').length + by_cat('x').length).toBe(8);
		expect(by_cat('b').length).toBeGreaterThan(0);
		expect(by_cat('m').length).toBeGreaterThan(0);
		expect(by_cat('x').length).toBeGreaterThan(0);
	});

	it('finds a book by slug and nothing by a bad one', () => {
		expect(book('waec')?.t).toBeTruthy();
		expect(book('not-a-book')).toBeUndefined();
	});
});

describe('bundles', () => {
	it('only ever references real books', () => {
		for (const u of bundles) {
			expect(u.m.length, `${u.i} members`).toBeGreaterThan(1);
			for (const id of u.m) expect(book(id), `${u.i} -> ${id}`).toBeTruthy();
		}
	});

	it('is always cheaper than buying the members separately', () => {
		for (const u of bundles) {
			expect(u.a, `${u.i} price`).toBeLessThan(list_price(u));
			expect(u.a % 100, `${u.i} is kobo`).toBe(0);
		}
	});

	it('has one bundle carrying the whole library', () => {
		const all = bundles.find((u) => u.m.length === books.length);
		expect(all).toBeTruthy();
		expect(list_price(all!)).toBe(books.reduce((n, b) => n + b.a, 0));
	});

	it('finds a bundle by slug', () => {
		expect(bundle(bundles[0].i)?.t).toBe(bundles[0].t);
		expect(bundle('not-a-bundle')).toBeUndefined();
	});
});

describe('item — the one function the money path depends on', () => {
	it('resolves a single book to itself', () => {
		const it_ = item('waec');
		expect(it_).toBeTruthy();
		expect(it_!.f).toEqual(['waec']);
		expect(it_!.a).toBe(book('waec')!.a);
	});

	it('resolves a bundle to every file it promises', () => {
		for (const u of bundles) {
			const it_ = item(u.i);
			expect(it_, u.i).toBeTruthy();
			expect(it_!.f, u.i).toEqual(u.m);
			expect(it_!.a, u.i).toBe(u.a);
		}
	});

	it('refuses an id that is neither', () => {
		expect(item('')).toBeUndefined();
		expect(item('bundle-that-never-was')).toBeUndefined();
	});

	it('never hands out a file that is not in the catalogue', () => {
		const slugs = new Set(books.map((b) => b.i));
		for (const id of [...books.map((b) => b.i), ...bundles.map((u) => u.i)]) {
			for (const f of item(id)!.f) expect(slugs.has(f), `${id} -> ${f}`).toBe(true);
		}
	});
});

describe('naira', () => {
	it('renders kobo as grouped naira', () => {
		expect(naira(250000)).toBe('₦2,500');
		expect(naira(2500000)).toBe('₦25,000');
		expect(naira(0)).toBe('₦0');
		expect(naira(99900)).toBe('₦999');
	});
});
