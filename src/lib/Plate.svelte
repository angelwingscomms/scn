<script lang="ts">
	import { open_buy } from '$lib/buy.svelte';
	import { naira, type Book } from '$lib/catalog';

	let { b, n }: { b: Book; n: number } = $props();
</script>

<article class="plate relative" style="--i:{n}">
	<a href="/b/{b.i}" class="block">
		<div class="relative overflow-hidden rounded-[2px] border border-plate-3 bg-plate-2">
			<img
				src="/covers/{b.i}-s.webp"
				srcset="/covers/{b.i}-s.webp 750w, /covers/{b.i}.webp 1100w"
				sizes="(min-width: 1280px) 20rem, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
				alt="cover of {b.t} by Dr. Michael Kekong"
				width="1100"
				height="1100"
				loading="lazy"
				decoding="async"
				class="plate-img aspect-square w-full object-cover"
			/>
			<div class="scan" aria-hidden="true"></div>
		</div>
		<p class="mt-5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ash">
			{b.p} pages · pdf
		</p>
		<h3 class="mt-2.5 font-display text-2xl sm:text-[1.7rem]">{b.t}</h3>
		<p class="mt-2.5 max-w-[40ch] text-sm leading-relaxed text-ash">{b.s}</p>
	</a>
	<div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
		<button
			type="button"
			onclick={() => open_buy(b.i)}
			class="rounded-[2px] border border-ember/60 px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ember transition-colors duration-200 hover:bg-ember hover:text-plate"
		>
			develop — {naira(b.a)}
		</button>
		<a
			href="/b/{b.i}"
			class="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ash transition-colors duration-200 hover:text-lume"
		>
			what is inside
		</a>
	</div>
</article>