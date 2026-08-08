<script lang="ts">
	import { author } from '$lib/catalog';

	let { data } = $props();
</script>

<svelte:head>
	<title>your downloads — {author.n}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="mx-auto max-w-3xl px-5 py-28 sm:px-8">
	{#if data.o}
		<p class="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-lume">exposure complete</p>
		<h1 class="mt-6 font-display text-huge">the plate is developed.</h1>
		<p class="mt-6 max-w-[46ch] text-base leading-relaxed text-ash">
			{data.o.t} is yours. nothing was emailed — the files are right here, and this page stays live at
			this exact link. bookmark it.
		</p>

		<ul class="mt-14 border-t border-plate-3">
			{#each data.o.f as f (f.i)}
				<li class="flex flex-wrap items-center justify-between gap-4 border-b border-plate-3 py-5">
					<span class="font-display text-xl">{f.t}</span>
					<a
						href="/d/{data.o.r}/{f.i}"
						class="rounded-[2px] bg-ember px-5 py-2.5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-plate transition-opacity duration-200 hover:opacity-85"
					>
						download pdf
					</a>
				</li>
			{/each}
		</ul>

		<p class="mt-10 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ash">
			reference {data.o.r} · {data.o.e}
		</p>
	{:else}
		<p class="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ember">nothing developed</p>
		<h1 class="mt-6 font-display text-huge">this plate is still dark.</h1>
		<p class="mt-6 max-w-[46ch] text-base leading-relaxed text-ash">{data.m}</p>
		<p class="mt-10 max-w-[46ch] text-sm leading-relaxed text-ash">
			if you were charged, nothing is lost. message whatsapp
			<a
				class="text-lume underline decoration-lume/30 underline-offset-4"
				href="https://wa.me/{author.w}"
				rel="noopener"
				target="_blank">{author.d}</a
			>
			with your payment reference and the files will be sent to you directly.
		</p>
		<a
			href="/"
			class="mt-12 inline-block font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash transition-colors duration-200 hover:text-lume"
		>
			← back to the library
		</a>
	{/if}
</section>