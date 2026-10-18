<script lang="ts">
	import { onMount } from 'svelte';
	import PostList from '$lib/PostList.svelte';
	import PushControls from '$lib/PushControls.svelte';
	let { data } = $props();
	let seen = $state(0);
	let loaded = $state(false);
	let message = $state('');
	const unread = $derived(data.l.filter((post) => post.p > seen).length);
	onMount(() => { try { seen = Number(localStorage.getItem('kekong_seen')) || 0; } catch { message = 'read status is available for this visit only'; } loaded = true; });
	function mark_read() { seen = data.l[0]?.p ?? Date.now(); try { localStorage.setItem('kekong_seen', String(seen)); } catch { message = 'read status is available for this visit only'; } }
</script>

<svelte:head><title>notifications · michael kekong</title><meta name="robots" content="noindex" /></svelte:head>
<section class="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
	<p class="font-mono text-xs tracking-widest text-lume">stay in the loop</p><h1 class="mt-5 text-huge">a note when it matters.</h1>
	<p class="mt-6 max-w-xl leading-relaxed text-ash">new posts, videos and announcements live here. no account needed. read status stays on this device.</p>
	<PushControls />
	<div class="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 class="font-sans text-base">recent updates{#if loaded && unread} · {unread} unread{/if}</h2>{#if data.l.length}<button type="button" onclick={mark_read} class="min-h-11 text-sm text-lume underline">mark all read</button>{/if}</div>
	{#if data.l.length}<PostList l={data.l} r={loaded ? seen || 1 : 0} />{:else}<p class="border-y border-plate-3 py-12 text-sm text-ash">nothing to catch up on yet. new posts will appear here.</p>{/if}
	{#if message}<p role="status" class="mt-4 text-sm text-ash">{message}</p>{/if}
	<a href="/updates" class="mt-8 inline-block py-3 text-sm text-lume underline">browse all posts</a>
</section>
