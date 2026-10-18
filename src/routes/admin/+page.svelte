<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Editor from '$lib/Editor.svelte';
	import Broadcast from '$lib/Broadcast.svelte';
	import { date_label, kinds } from '$lib/content';
	let { data, form } = $props();
</script>

<svelte:head><title>publishing · kekong</title><meta name="robots" content="noindex,nofollow" /></svelte:head>

<section class="mx-auto max-w-7xl px-5 py-16 sm:px-8">
	<div class="mb-10 flex flex-wrap items-end justify-between gap-5"><div><p class="mb-3 font-mono text-xs tracking-widest text-lume">owner studio</p><h1 class="text-huge">something worth sharing.</h1></div>{#if data.o}<form method="POST" action="?/logout"><button type="submit" class="min-h-11 text-sm text-ash underline">sign out</button></form>{/if}</div>
	{#if !data.o}
		{#if !data.r}<p class="max-w-lg border border-plate-3 bg-plate-2 p-6 text-sm leading-relaxed">publishing is ready for setup. set ADMIN_PASSWORD to a strong password of at least 10 characters in the worker secrets, then sign in here.</p>{:else}
			<form method="POST" action="?/login" use:enhance class="max-w-sm space-y-5">
				<label class="grid gap-2 text-sm">owner password<input type="password" name="p" autocomplete="current-password" required class="border border-plate-3 bg-plate px-3 py-3" /></label>
				{#if form?.m}<p role="alert" class="text-sm text-ember">{form.m}</p>{/if}
				<button class="min-h-11 bg-lume px-6 py-3 text-sm text-plate" type="submit">sign in</button>
			</form>
		{/if}
	{:else}
		{#if page.url.searchParams.has('saved')}<p role="status" class="mb-6 border border-plate-3 bg-plate-2 px-4 py-3 text-sm">{data.p?.d === 'p' ? 'published — your post is live.' : 'draft saved — only you can see it.'}</p>{/if}
		{#if page.url.searchParams.has('removed')}<p role="status" class="mb-6 text-sm text-lume">post deleted.</p>{/if}
		<div class="grid gap-12 lg:grid-cols-[17rem_1fr]">
			<aside><a href="/admin" class="mb-6 block border border-lume px-4 py-3 text-center text-sm text-lume">+ new post</a><h2 class="mb-4 font-sans text-sm">your posts · {data.l.length}</h2><div class="max-h-[65vh] space-y-1 overflow-y-auto">{#each data.l as post (post.i)}<a href="/admin?i={post.i}" aria-current={data.p?.i === post.i ? 'page' : undefined} class="block border-b border-plate-3 p-3 hover:bg-plate-2 aria-[current=page]:bg-plate-2"><p class="text-xs text-ash">{kinds[post.k]} · {post.d === 'd' ? 'draft' : 'published'}</p><p class="mt-1 text-sm">{post.t}</p><p class="mt-2 text-xs text-ash">{date_label(post.u)}</p></a>{:else}<p class="text-sm text-ash">your first post starts here.</p>{/each}</div></aside>
			<div>{#if data.p}{#key data.p.i}<Editor p={form?.p ?? data.p} m={form?.m} />{#if data.p.d === 'p'}<Broadcast i={data.p.i} />{/if}{/key}{/if}</div>
		</div>
	{/if}
</section>
