<script lang="ts">
	import Plate from '$lib/Plate.svelte';
	import { develop } from '$lib/light';
	import { by_cat, cats, type Cat } from '$lib/catalog';

	const shelves = Object.keys(cats) as Cat[];
</script>

<section id="library" class="scroll-mt-24 px-5 sm:px-8">
	<div class="mx-auto max-w-[88rem]">
		<div use:develop>
			<h2 class="max-w-[18ch] font-display text-huge">
				nothing here is a secret. <em class="text-lume">it is just unlit.</em>
			</h2>
		</div>
		<div class="sticky top-[3.4rem] z-30 -mx-5 mt-8 flex gap-2 overflow-x-auto border-y border-plate-3/40 bg-plate/90 px-5 py-3 backdrop-blur-md sm:mx-0 sm:rounded-[2px] sm:border">
			{#each shelves as c (c)}
				<a href="#shelf-{c}" class="whitespace-nowrap rounded-full border border-plate-3 px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ash transition-colors hover:border-lume hover:text-lume">{cats[c].n}</a>
			{/each}
		</div>

		{#each shelves as c (c)}
			<div id="shelf-{c}" class="mt-24 scroll-mt-32 sm:mt-32">
				<div use:develop class="flex flex-wrap items-baseline gap-x-6 gap-y-2">
					<p class="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ember">{cats[c].k}</p>
					<h3 class="font-display text-big">{cats[c].n}</h3>
					<p class="max-w-[40ch] text-sm text-ash">{cats[c].s}</p>
				</div>
				<div class="rule mt-7"></div>
				<div
					use:develop
					class="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
				>
					{#each by_cat(c) as b, n (b.i)}
						<Plate {b} {n} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>