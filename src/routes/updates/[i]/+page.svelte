<script lang="ts">
	import { date_label, kinds } from '$lib/content';
	let { data } = $props();
	let message = $state('');
	async function share() {
		try { if (navigator.share) await navigator.share({ title: data.p.t, url: `https://kekong.me/updates/${data.p.i}` }); else { await navigator.clipboard.writeText(`https://kekong.me/updates/${data.p.i}`); message = 'link copied'; } }
		catch (cause) { if ((cause as Error).name !== 'AbortError') message = 'copy the link from your address bar to share this post'; }
	}
</script>

<svelte:head><title>{data.p.t} · michael kekong</title><meta name="description" content={data.p.s || data.p.b.slice(0, 160)} /><meta property="og:title" content={data.p.t} /><meta property="og:description" content={data.p.s || data.p.b.slice(0, 160)} />{#if data.p.d === 'd'}<meta name="robots" content="noindex,nofollow" />{/if}</svelte:head>

<article class="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
	<a href="/updates" class="inline-block py-3 text-sm text-lume">← from the desk</a>
	{#if data.p.d === 'd'}<p class="mt-6 border border-ember bg-plate-2 p-4 text-sm">draft preview · only visible to you · <a class="underline" href="/admin?i={data.p.i}">back to editor</a></p>{/if}
	<p class="mt-8 font-mono text-xs text-ash">{kinds[data.p.k]} · michael kekong{#if data.p.p} · <time datetime={new Date(data.p.p).toISOString()}>{date_label(data.p.p)}</time>{/if}</p>
	<h1 class="mt-5 break-words text-huge leading-tight">{data.p.t}</h1>
	{#if data.p.s}<p class="mt-6 text-lg leading-relaxed text-ash">{data.p.s}</p>{/if}
	{#if data.p.k === 'v' && data.p.v}
		<!-- svelte-ignore a11y_media_has_caption (the author can provide the accessible transcript below) -->
		<video controls playsinline preload="metadata" aria-label={data.p.t} class="mt-10 max-h-[75svh] w-full bg-plate-2" src="/media/{data.p.v}"></video>
	{/if}
	<div class="mt-10 space-y-6 break-words text-base leading-loose sm:text-lg">{#each data.p.b.split(/\n\s*\n/) as paragraph}<p class="whitespace-pre-line">{paragraph}</p>{/each}</div>
	{#if data.p.c}<details class="mt-10 border-y border-plate-3 py-5"><summary class="cursor-pointer text-sm text-lume">read the video transcript</summary><p class="mt-5 whitespace-pre-line text-sm leading-loose">{data.p.c}</p></details>{/if}
	<div class="mt-12 flex flex-wrap items-center gap-6 border-t border-plate-3 pt-6"><button type="button" onclick={share} class="min-h-11 text-sm text-lume underline">share this post</button><a href="/notifications" class="py-3 text-sm text-lume underline">get the next one</a><p role="status" class="text-xs text-ash">{message}</p></div>
</article>
