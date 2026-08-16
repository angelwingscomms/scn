<script lang="ts">
	import { light } from '$lib/light';
	import { open_buy } from '$lib/buy.svelte';
	import { bundle, naira } from '$lib/catalog';

	const all = bundle('bundle-all')!;

	const whispers = [
		{ t: 'your salary is leaking in five places', k: 'left-[2%] top-[6%]' },
		{ t: 'your heart warns you months before it stops', k: 'right-[3%] top-[13%]' },
		{ t: 'the syllabus changed. nobody told the students.', k: 'left-[8%] top-[24%] hidden sm:block' },
		{ t: 'a degree is not a plan', k: 'right-[10%] top-[31%]' },
		{ t: 'high blood pressure has no symptoms until it does', k: 'left-[1%] top-[44%] hidden sm:block' },
		{ t: 'you are paying for things you forgot you subscribed to', k: 'right-[2%] top-[52%] hidden sm:block' },
		{ t: 'past questions repeat', k: 'left-[14%] top-[62%]' },
		{ t: 'kidneys fail quietly, at eighty percent gone', k: 'right-[7%] top-[70%] hidden sm:block' },
		{ t: 'the free ai tools are free', k: 'left-[4%] top-[78%]' },
		{ t: 'looking fine is what keeps you broke', k: 'right-[12%] top-[85%]' },
		{ t: 'liver damage is reversible — early', k: 'left-[20%] top-[92%] hidden sm:block' },
		{ t: 'you can study less and score more', k: 'right-[1%] top-[96%] hidden sm:block' }
	];
</script>

{#snippet field()}
	<div class="absolute inset-0">
		{#each whispers as w (w.t)}
			<span
				class="absolute {w.k} whitespace-nowrap font-mono text-[0.58rem] uppercase tracking-[0.18em] text-lume sm:text-[0.7rem]"
			>
				{w.t}
			</span>
		{/each}
	</div>
{/snippet}

<section
	use:light
	class="relative isolate flex min-h-[92svh] flex-col justify-center overflow-hidden px-5 pt-16 pb-16 sm:px-8 sm:pt-20 sm:pb-20"
>
	<div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
		<div class="field-dim absolute inset-0">{@render field()}</div>
		<div class="field-lit">{@render field()}</div>
	</div>

	<div class="mx-auto w-full max-w-[88rem]">
		<p class="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-ash sm:text-[0.66rem]">
			michael kekong · eight blueprints · pdf · instant
		</p>

		<h1 class="mt-7 max-w-[15ch] font-display text-mega">
			the things nobody tells you <em class="text-lume">until it is already late</em>
		</h1>

		<p class="mt-9 max-w-[46ch] text-base leading-relaxed text-ash sm:text-lg">
			eight blueprints on the body, the money and the exams. nothing here is a secret. it is just
			unlit — and most people never bring a light.
		</p>

		<div class="mt-11 flex flex-wrap items-center gap-4">
			<button
				type="button"
				onclick={() => open_buy(all.i)}
				class="rounded-[2px] bg-ember px-7 py-3.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-plate transition-opacity duration-200 hover:opacity-85"
			>
				develop all eight — {naira(all.a)}
			</button>
			<a
				href="#library"
				class="rounded-[2px] border border-plate-3 px-7 py-3.5 font-mono text-[0.68rem] uppercase tracking-[0.18em] text-bone transition-colors duration-200 hover:border-lume hover:text-lume"
			>
				see the library
			</a>
		</div>

		<p
			class="mt-14 hidden font-mono text-[0.58rem] uppercase tracking-[0.22em] text-ash/70 pointer-fine:block"
		>
			move your cursor — the page develops where you look
		</p>
	</div>
</section>