<script lang="ts">
	import { develop } from '$lib/light';
	import { open_buy } from '$lib/buy.svelte';
	import Plate from '$lib/Plate.svelte';
	import { author, books, cats, naira } from '$lib/catalog';

	let { data } = $props();

	const b = $derived(data.b);
	const rest = $derived(books.filter((x) => x.c === b.c && x.i !== b.i));
</script>

<svelte:head>
	<title>{b.t} — {author.n}</title>
	<meta name="description" content={b.s} />
	<meta property="og:title" content={b.t} />
	<meta property="og:description" content={b.s} />
	<meta property="og:image" content="/covers/{b.i}.webp" />
	<link rel="canonical" href="https://scn.apexlinks.org/b/{b.i}" />
</svelte:head>

<article class="px-5 pt-20 sm:px-8">
	<div class="mx-auto grid max-w-[88rem] gap-14 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20">
		<div class="plate relative lg:sticky lg:top-28 lg:self-start">
			<div class="relative overflow-hidden rounded-[2px] border border-plate-3 bg-plate-2">
				<img
					src="/covers/{b.i}.webp"
					alt="cover of {b.t} by {author.n}"
					width="1100"
					height="1100"
					class="plate-img aspect-square w-full object-cover"
				/>
				<div class="scan" aria-hidden="true"></div>
			</div>
			<p class="mt-6 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash">
				{cats[b.c].k} · {cats[b.c].n} · {b.p} pages · pdf
			</p>
		</div>

		<div>
			<a
				href="/#library"
				class="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ash transition-colors duration-200 hover:text-lume"
			>
				← the library
			</a>

			<h1 class="mt-8 max-w-[18ch] font-display text-huge">{b.t}</h1>
			<p class="mt-6 max-w-[46ch] text-lg leading-relaxed text-bone">{b.s}</p>

			<div class="rule mt-12"></div>

			<p class="mt-12 max-w-[30ch] font-display text-big text-lume">{b.h}</p>

			<p class="mt-10 max-w-[58ch] text-base leading-relaxed text-ash">{b.d}</p>

			<div use:develop class="mt-16">
				<h2 class="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ember">what is inside</h2>
				<ul class="mt-7 border-t border-plate-3">
					{#each b.l as line, n (line)}
						<li
							class="border-b border-plate-3 py-4 text-sm leading-relaxed text-bone"
							style="--i:{n}"
						>
							{line}
						</li>
					{/each}
				</ul>
			</div>

			<div class="mt-16">
				<h2 class="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ember">who it is for</h2>
				<p class="mt-5 max-w-[52ch] text-base leading-relaxed text-bone">{b.w}</p>
			</div>

			<div
				class="mt-16 flex flex-wrap items-center gap-6 rounded-[2px] border border-plate-3 bg-plate-2 p-8"
			>
				<p class="font-display text-4xl text-ember">{naira(b.a)}</p>
				<button
					type="button"
					onclick={() => open_buy(b.i)}
					class="rounded-[2px] bg-ember px-7 py-3.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-plate transition-opacity duration-200 hover:opacity-85"
				>
					develop this plate
				</button>
				<p class="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ash">
					instant pdf · card, transfer, ussd, opay, palmpay
				</p>
			</div>
		</div>
	</div>

	{#if rest.length}
		<div class="mx-auto mt-40 max-w-[88rem]">
			<h2 class="font-display text-big">also on this shelf</h2>
			<div class="rule mt-6"></div>
			<div use:develop class="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each rest as x, n (x.i)}
					<Plate b={x} {n} />
				{/each}
			</div>
		</div>
	{/if}
</article>