<script lang="ts">
	import '../app.css';
	import Checkout from '$lib/Checkout.svelte';
	import { open_buy } from '$lib/buy.svelte';
	import { author, bundle, naira } from '$lib/catalog';

	let { children } = $props();

	const all = bundle('bundle-all')!;
</script>

<svelte:head>
	<link rel="icon" href="/favicon.svg" />
	<meta property="og:site_name" content="Dr. Michael Kekong" />
	<meta property="og:image" content="/og.jpg" />
	<meta property="og:type" content="website" />
	<link rel="canonical" href="https://scn.apexlinks.org" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="grain" aria-hidden="true"></div>

<header class="fixed inset-x-0 top-0 z-50 border-b border-plate-3/60 bg-plate/75 backdrop-blur-md">
	<nav class="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
		<a href="/" class="font-display text-xl leading-none text-bone sm:text-2xl">
			kekong<span class="text-lume">.</span>
		</a>
		<div class="flex items-center gap-5 sm:gap-8">
			<a
				href="/#library"
				class="hidden font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash transition-colors duration-200 hover:text-bone sm:block"
			>
				the library
			</a>
			<a
				href="/#bundles"
				class="hidden font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash transition-colors duration-200 hover:text-bone sm:block"
			>
				bundles
			</a>
			<button
				type="button"
				onclick={() => open_buy(all.i)}
				class="rounded-[2px] border border-ember/60 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ember transition-colors duration-200 hover:bg-ember hover:text-plate"
			>
				all eight — {naira(all.a)}
			</button>
		</div>
	</nav>
</header>

<main class="pt-[3.4rem]">{@render children()}</main>

<footer class="mt-32 border-t border-plate-3 px-5 py-16 sm:px-8">
	<div class="mx-auto grid max-w-[88rem] gap-10 sm:grid-cols-3">
		<div>
			<p class="font-display text-2xl">{author.n}</p>
			<p class="mt-3 max-w-[34ch] text-sm leading-relaxed text-ash">
				prevention, income and exam blueprints — written plainly, for people who were never handed the
				manual.
			</p>
		</div>
		<div class="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ash">
			<p><a class="transition-colors duration-200 hover:text-bone" href="/#library">the library</a></p>
			<p class="mt-3"><a class="transition-colors duration-200 hover:text-bone" href="/#bundles">bundles</a></p>
			<p class="mt-3"><a class="transition-colors duration-200 hover:text-bone" href="/#questions">questions</a></p>
			<p class="mt-3">
				<a
					class="transition-colors duration-200 hover:text-bone"
					href="https://wa.me/{author.w}"
					rel="noopener"
					target="_blank">whatsapp {author.d}</a
				>
			</p>
		</div>
		<div class="text-xs leading-relaxed text-ash/80">
			<p>
				these guides are educational. they are not medical, financial or legal advice — see a qualified
				professional before acting on anything health or money related.
			</p>
			<p class="mt-4 font-mono uppercase tracking-[0.18em]">© 2026 {author.n}</p>
		</div>
	</div>
</footer>

<Checkout />