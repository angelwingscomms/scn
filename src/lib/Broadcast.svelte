<script lang="ts">
	import { onMount } from 'svelte';
	import type { Delivery } from '$lib/server/push';
	let { i }: { i: string } = $props();
	let ready = $state(false);
	let busy = $state(false);
	let delivery = $state<Delivery | null>(null);
	let message = $state('');
	onMount(async () => {
		try { const response = await fetch(`/api/notify/${i}`); if (!response.ok) throw new Error(); const result = await response.json(); ready = result.r; delivery = result.d; }
		catch { message = 'could not load delivery status — reload to try again'; }
	});
	async function send() {
		if (!window.confirm(delivery?.d && delivery.f ? 'retry this notification for all followers? some people may receive it again.' : 'send this post as a browser notification to opted-in followers?')) return;
		busy = true; message = '';
		let retry = Boolean(delivery?.d && delivery.f);
		try {
			do {
				const response = await fetch(`/api/notify/${i}${retry ? '?retry=1' : ''}`, { method: 'POST' });
				const result = await response.json();
				if (!response.ok) throw new Error(result.message ?? 'delivery interrupted — continue to resume');
				delivery = result.d; retry = false;
			} while (delivery && !delivery.d);
			message = 'delivery finished';
		} catch (cause) { message = (cause as Error).message; }
		finally { busy = false; }
	}
</script>

<div class="mt-10 border-t border-plate-3 pt-6"><h2 class="font-sans text-base">notify followers</h2><p class="mt-2 text-sm leading-relaxed text-ash">publishing adds the post to the feed and on-site inbox. send a browser alert separately when it matters.</p>{#if ready}{#if delivery}<p class="mt-3 text-sm text-ash" aria-live="polite">{delivery.s} sent · {delivery.f} failed{delivery.d ? ' · complete' : ' · delivery can be resumed'}</p>{/if}<button type="button" disabled={busy || Boolean(delivery?.d && !delivery?.f)} onclick={send} class="mt-4 min-h-11 border border-lume px-5 py-3 text-sm text-lume disabled:opacity-50">{busy ? 'sending… keep this page open' : delivery?.d ? delivery.f ? 'retry notification' : 'notification sent' : delivery ? 'continue delivery' : 'send browser notification'}</button>{:else}<p class="mt-3 text-sm text-ash">browser alerts need the VAPID keys in worker secrets.</p>{/if}{#if message}<p role="status" class="mt-3 text-sm text-ash">{message}</p>{/if}</div>
