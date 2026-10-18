<script lang="ts">
	import PostList from '$lib/PostList.svelte';
	import { kinds } from '$lib/content';
	let { data } = $props();
</script>

<svelte:head><title>from the desk · michael kekong</title><meta name="description" content="Short videos, articles and everyday observations from Michael Kekong." /><meta property="og:title" content="from the desk · michael kekong" /></svelte:head>

<section class="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
	<p class="font-mono text-xs tracking-widest text-lume">michael kekong · in between the books</p>
	<h1 class="mt-5 text-huge">from the desk.</h1>
	<p class="mt-6 max-w-xl text-base leading-relaxed text-ash">a thought, a longer read, a few minutes on camera. things worth sharing while they are still fresh.</p>
	<div class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm"><a href="/notifications" class="py-2 text-lume underline">get notified</a><a href="/feed.xml" class="py-2 text-ash underline">rss feed</a></div>
	<nav aria-label="filter updates" class="mt-10 mb-8 flex flex-wrap gap-2"><a href="/updates" aria-current={!data.k ? 'page' : undefined} class="border border-plate-3 px-4 py-3 text-sm aria-[current=page]:border-lume aria-[current=page]:bg-lume aria-[current=page]:text-plate">all posts</a>{#each Object.entries(kinds) as [key, label]}<a href="/updates?k={key}" aria-current={data.k === key ? 'page' : undefined} class="border border-plate-3 px-4 py-3 text-sm aria-[current=page]:border-lume aria-[current=page]:bg-lume aria-[current=page]:text-plate">{label === 'article' ? 'articles' : label === 'video' ? 'videos' : `${label}s`}</a>{/each}</nav>
	{#if data.l.length}<PostList l={data.l} />{:else}<div class="border-y border-plate-3 py-16"><h2 class="text-big">a quiet desk, for now.</h2><p class="mt-4 text-sm text-ash">{data.k ? 'nothing in this category yet.' : 'new posts will appear here.'}</p><a href="/notifications" class="mt-6 inline-block py-2 text-sm text-lume underline">be here for the next one</a></div>{/if}
	{#if data.n > 1}<nav aria-label="update pages" class="mt-8 flex items-center justify-between text-sm">{#if data.p > 1}<a href="/updates?k={data.k}&p={data.p - 1}" class="py-3 text-lume">← newer</a>{:else}<span></span>{/if}<span class="text-ash">{data.p} / {data.n}</span>{#if data.p < data.n}<a href="/updates?k={data.k}&p={data.p + 1}" class="py-3 text-lume">older →</a>{:else}<span></span>{/if}</nav>{/if}
</section>
