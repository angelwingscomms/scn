<script lang="ts">
	import { date_label, kinds, type Summary } from '$lib/content';
	let { l, r = 0 }: { l: Summary[]; r?: number } = $props();
</script>

<div class="divide-y divide-plate-3 border-y border-plate-3">
	{#each l as post (post.i)}
		<article class="grid gap-4 py-8 sm:grid-cols-[9rem_1fr]">
			<div class="text-xs leading-relaxed text-ash"><p class="font-mono text-lume">{kinds[post.k]}</p><time datetime={new Date(post.p).toISOString()}>{date_label(post.p)}</time>{#if r && post.p > r}<span class="mt-2 block text-ember">unread</span>{/if}</div>
			<div><h2 class="font-display text-big leading-tight"><a href="/updates/{post.i}" class="transition-colors hover:text-lume">{post.t}</a></h2>{#if post.s}<p class="mt-4 max-w-prose text-sm leading-relaxed text-ash">{post.s}</p>{/if}<a href="/updates/{post.i}" class="mt-5 inline-block py-2 text-sm text-lume">{post.k === 'v' ? 'watch video' : 'read post'} <span aria-hidden="true">↗</span><span class="sr-only">: {post.t}</span></a></div>
		</article>
	{/each}
</div>
