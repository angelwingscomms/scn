<script lang="ts">
	import { ctrl_enter } from '$lib/actions';
	import { buy } from '$lib/buy.svelte';
	import { item, naira } from '$lib/catalog';

	let box: HTMLDialogElement;
	let email = $state('');
	let busy = $state(false);
	let err = $state('');

	const picked = $derived(item(buy.i));

	$effect(() => {
		if (buy.i && !box.open) box.showModal();
		if (!buy.i && box.open) box.close();
	});

	function shut() {
		buy.i = '';
		busy = false;
		err = '';
	}

	async function pay() {
		if (busy || !picked) return;
		if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
			err = 'that email does not look right';
			return;
		}
		busy = true;
		err = '';
		let fallback = '';
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ e: email, i: buy.i })
			});
			const d = await res.json();
			if (!res.ok) throw new Error(d.m ?? 'payment could not be started');
			fallback = d.u;
			const pop = new ((await import('@paystack/inline-js')).default)();
			const bail = setTimeout(() => (location.href = fallback), 15000);
			pop.resumeTransaction(d.k, {
				onLoad: () => clearTimeout(bail),
				onSuccess: (tx: { reference: string }) => {
					clearTimeout(bail);
					location.href = `/r?reference=${encodeURIComponent(tx.reference)}`;
				},
				onCancel: () => {
					clearTimeout(bail);
					busy = false;
				},
				onError: () => {
					clearTimeout(bail);
					location.href = fallback;
				}
			});
		} catch (e) {
			if (fallback) location.href = fallback;
			else {
				err = e instanceof Error ? e.message : 'network trouble — try again';
				busy = false;
			}
		}
	}
</script>

<dialog
	bind:this={box}
	onclose={shut}
	class="m-auto w-[min(30rem,92vw)] rounded-[3px] border border-plate-3 bg-plate-2 p-0 text-bone"
>
	{#if picked}
		<div use:ctrl_enter={pay} class="p-7 sm:p-9">
			<p class="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-ash">develop this plate</p>
			<h2 class="mt-4 font-display text-3xl leading-tight">{picked.t}</h2>
			<p class="mt-3 font-mono text-sm text-ember">{naira(picked.a)}</p>

			<label class="mt-8 block font-mono text-[0.6rem] uppercase tracking-[0.24em] text-ash" for="buyer">
				where should we develop it
			</label>
			<input
				id="buyer"
				type="email"
				inputmode="email"
				autocomplete="email"
				placeholder="your@email.com"
				bind:value={email}
				class="mt-3 w-full rounded-[2px] border border-plate-3 bg-plate px-4 py-3 text-base text-bone outline-none transition-colors duration-200 placeholder:text-ash/50 focus:border-lume"
			/>
			<p class="mt-3 text-xs leading-relaxed text-ash">
				your receipt and downloads open on the next page. nothing is emailed, nothing is stored.
			</p>

			{#if err}
				<p class="mt-4 text-sm text-ember">{err}</p>
			{/if}

			<div class="mt-8 flex items-center justify-between gap-4">
				<button
					type="button"
					onclick={shut}
					class="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-ash transition-colors duration-200 hover:text-bone"
				>
					not now
				</button>
				<button
					type="button"
					onclick={pay}
					disabled={busy}
					class="rounded-[2px] bg-ember px-6 py-3 font-mono text-[0.66rem] uppercase tracking-[0.2em] text-plate transition-opacity duration-200 hover:opacity-85 disabled:opacity-50"
				>
					{busy ? 'opening paystack…' : 'pay ' + naira(picked.a)}
				</button>
			</div>
			<p class="mt-5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-ash">
				card · transfer · ussd · opay · palmpay — ctrl+enter to pay
			</p>
		</div>
	{/if}
</dialog>