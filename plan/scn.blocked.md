# scn blocked at a_foundation.paystack

when: 2026-08-07T13:35:02.170Z
head: c638f3c
why: staged paystack.test.ts cannot typecheck under installed vitest 4.1.10: '@vitest/spy' declares `declare function fn<T extends Procedure | Constructable = Procedure>(originalImplementation?: T): Mock<T>`, so `vi.fn(() => ok(...))` infers T = () => Promise<Response> and fetch_.mock.calls[0] is typed [] (empty tuple). The two casts `as [string, RequestInit]` (line 42) and `calls[0][0]` (line 86) fail: 'Conversion of type [] to type [string, RequestInit]' / 'Tuple type [] has no element at index 0'. svelte-check reports these (pnpm test itself passes 24/24). No implementation change can fix a test-side cast. Planner: amend the staged test — e.g. type the mock loosely: `const fetch_: Mock = vi.fn(() => ok(...))` (import type { Mock } from 'vitest') or `vi.fn<any>(() => ok(...))`, or cast `fetch_.mock.calls[0] as unknown as [string, RequestInit]`.

ALSO (already fixed here, note for the plan): wrangler 4.119 `pnpm gen` now emits a runtime-types bundle plus `mainModule: typeof import('./.svelte-kit/cloudflare/_worker')` which drags the built worker and its whole output graph into svelte-check (599 errors). I regenerated with `wrangler types --no-include-runtime` and trimmed the mainModule line (nothing in src uses GlobalProps); worker-configuration.d.ts is now a minimal Env-only file and svelte-check passes apart from the two test casts. Recommend pinning the gen script to `wrangler types --no-include-runtime` and noting the trim.

## the step

- a_foundation: assets, design tokens, catalogue and the paystack layer — nothing renders until these exist

The payment and secrets layer, plus the Worker bindings. No UI in this step.

1. COPY the staged test byte for byte:

    cp plan/tests/src/lib/paystack.test.ts.txt src/lib/paystack.test.ts

2. INSTALL the popup library:

    pnpm add @paystack/inline-js

3. CREATE src/lib/secret.ts with exactly this content:

export type SecretVal = string | { get?: () => Promise<string> };

export async function get_secret(v: SecretVal | undefined | null): Promise<string> {
	if (!v) return '';
	if (typeof v === 'string') return v;
	return (await v.get?.()) ?? '';
}

This is the abstraction every secret read goes through, so a plain Worker secret (a string) and a
Cloudflare Secrets Store binding (an object with an async get) are interchangeable. Never read a secret
binding as a raw string anywhere else, and never call .get() outside this file.

4. CREATE src/lib/paystack.ts with exactly this content:

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

meta_item exists because Paystack echoes metadata back as an object on some responses and as the JSON
string we sent on others. Every route reads the item id through it, never directly.

5. EDIT wrangler.jsonc. It currently ends with these three lines before the closing brace:

	"workers_dev": true,
	"preview_urls": true
}

Replace that tail with:

	"workers_dev": true,
	"preview_urls": true,
	"r2_buckets": [
		{
			"binding": "F",
			"bucket_name": "scn"
		}
	],
	"observability": {
		"enabled": true
	}
}

Do not add secrets_store_secrets. PAYSTACK_SECRET_KEY is a per-Worker secret set with
`wrangler secret put` in the deploy step, and get_secret handles either shape if that ever changes.

6. REGENERATE the binding types so platform.env.F is typed:

    pnpm gen

That writes worker-configuration.d.ts, which tsconfig.json already lists under "types". COMMIT that
generated file — the build script must never run `wrangler types` itself.

7. CREATE .env at the repo root with exactly:

PAYSTACK_SECRET_KEY=sk_test_replace_me

.env is already gitignored. NEVER create .dev.vars. Leave the placeholder value; the real test key is
put in by hand and the live key is set as a Worker secret at deploy time.

## v

```
test -f plan/tests/src/lib/paystack.test.ts.txt && grep -qF '"preview_urls": true' wrangler.jsonc
```

## t

```
bash plan/verify_tests.sh && test -f worker-configuration.d.ts && grep -qF '"binding": "F"' wrangler.jsonc && grep -qF 'PAYSTACK_SECRET_KEY' .env && test ! -f .dev.vars && grep -q '@paystack/inline-js' package.json && ! grep -qE '"(build|check)": *"[^"]*wrangler types' package.json && pnpm test && pnpm check && pnpm build
```

## next

planner: amend plan/scn.plan.json, then delete this file.