<script lang="ts">
	import { develop } from '$lib/light';
	import { open_buy } from '$lib/buy.svelte';
	import { author, book, bundles, list_price, naira } from '$lib/catalog';

	const questions = [
		{
			q: 'how do i pay?',
			a: 'card, bank transfer, ussd, opay or palmpay — whatever paystack shows you. no account, no signup.'
		},
		{
			q: 'when do i get the files?',
			a: 'the moment the payment clears. the next page is your download page. no waiting for an email, no chasing anybody on whatsapp.'
		},
		{
			q: 'what format are they?',
			a: 'pdf. they open on any phone, laptop or tablet, and they are yours to keep — no app, no expiry.'
		},
		{
			q: 'i closed the tab and lost my downloads',
			a: 'your download page stays live at that same link. if you lost the link, message whatsapp ' + author.d + ' with the payment reference and it will be re-sent.'
		},
		{
			q: 'can i get a refund?',
			a: 'these are digital files delivered instantly, so sales are final. everything inside each book is listed on its own page — read that first, then buy.'
		},
		{
			q: 'is the health material medical advice?',
			a: 'no. it is education about prevention and early warning signs. it does not replace a doctor, a test or a prescription.'
		}
	];
</script>

<section id="bundles" class="mt-40 scroll-mt-24 px-5 sm:px-8">
	<div class="mx-auto max-w-[88rem]">
		<div use:develop>
			<p class="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ember">04</p>
			<h2 class="mt-4 max-w-[20ch] font-display text-huge">develop the whole plate at once</h2>
		</div>
		<div use:develop class="mt-14 grid gap-6 lg:grid-cols-2">
			{#each bundles as u, n (u.i)}
				{@const full = list_price(u)}
				{@const save = full - u.a}
				{@const pct = full ? Math.round((save / full) * 100) : 0}
				<div
					class="flex flex-col justify-between rounded-[2px] p-8 sm:p-10 {u.i === 'bundle-all' ? 'border border-ember/40 bg-ember/10' : 'border border-plate-3 bg-plate-2'}"
					style="--i:{n}"
				>
					<div>
						{#if u.i === 'bundle-all'}
							<p class="inline-block rounded-full bg-ember px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.18em] text-plate">most picked · save {naira(save)} ({pct}%)</p>
						{/if}
						<h3 class="font-display text-big" class:mt-3={u.i === 'bundle-all'}>{u.t}</h3>
						<p class="mt-3 max-w-[42ch] text-sm leading-relaxed text-ash">{u.s}</p>
						<ul class="mt-7 space-y-2">
							{#each u.m as i (i)}
								<li class="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ash">
									{book(i)?.t}
								</li>
							{/each}
						</ul>
					</div>
					<div class="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2">
						<p class="font-display text-3xl text-ember">{naira(u.a)}</p>
						<p class="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ash line-through">
							{naira(full)}
						</p>
						{#if save > 0}
							<p class="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ember">save {naira(save)} · {pct}% off</p>
						{/if}
						<button
							type="button"
							onclick={() => open_buy(u.i)}
							class="ml-auto rounded-[2px] bg-ember px-6 py-3 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-plate transition-opacity duration-200 hover:opacity-85"
						>
							develop
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="mt-40 px-5 sm:px-8">
	<div use:develop class="mx-auto grid max-w-[88rem] gap-12 sm:grid-cols-3">
		<div style="--i:0">
			<p class="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-lume">01 — pay</p>
			<p class="mt-4 text-sm leading-relaxed text-ash">
				card, transfer, ussd or your wallet, through paystack. we never see your card.
			</p>
		</div>
		<div style="--i:1">
			<p class="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-lume">02 — develop</p>
			<p class="mt-4 text-sm leading-relaxed text-ash">
				the plate flares the second the payment clears. no waiting room, no email queue.
			</p>
		</div>
		<div style="--i:2">
			<p class="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-lume">03 — keep</p>
			<p class="mt-4 text-sm leading-relaxed text-ash">
				download the pdfs and keep them forever. no app, no login, no expiry.
			</p>
		</div>
	</div>
</section>

<section class="mt-40 px-5 sm:px-8">
	<div use:develop class="mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-[1fr_1.1fr]">
		<h2 class="max-w-[16ch] font-display text-huge">who is holding the light</h2>
		<div class="max-w-[54ch] space-y-5 text-base leading-relaxed text-ash">
			<p>
				{author.n} writes about the two things that ruin a life quietly — a body nobody checked and money
				nobody tracked — and the two exams that decide what a nigerian teenager gets to become.
			</p>
			<p>
				the books are deliberately plain. no jargon, no motivational filler, no theory you cannot use
				on a tuesday. every one ends with a plan you can actually finish: thirty days, ninety days,
				four weeks, week by week.
			</p>
			<p>
				questions before you buy?
				<a
					class="text-lume underline decoration-lume/30 underline-offset-4 transition-colors duration-200 hover:decoration-lume"
					href="https://wa.me/{author.w}"
					rel="noopener"
					target="_blank">whatsapp {author.d}</a
				>.
			</p>
		</div>
	</div>
</section>

<section id="questions" class="mt-40 scroll-mt-24 px-5 sm:px-8">
	<div class="mx-auto max-w-[88rem]">
		<div use:develop>
			<h2 class="font-display text-huge">before you pay</h2>
		</div>
		<div use:develop class="mt-12 border-t border-plate-3">
			{#each questions as x, n (x.q)}
				<details class="group border-b border-plate-3" style="--i:{n}">
					<summary
						class="cursor-pointer list-none py-6 font-display text-xl transition-colors duration-200 hover:text-lume sm:text-2xl"
					>
						{x.q}
					</summary>
					<p class="max-w-[62ch] pb-7 text-sm leading-relaxed text-ash">{x.a}</p>
				</details>
			{/each}
		</div>
	</div>
</section>