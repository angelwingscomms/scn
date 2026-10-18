<script lang="ts">
	import { onMount } from 'svelte';
	let supported = $state(false);
	let active = $state(false);
	let ready = $state(false);
	let busy = $state(false);
	let key = $state('');
	let message = $state('checking notification settings…');
	onMount(async () => {
		supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
		if (!supported) { message = 'browser push is unavailable here. on iphone or ipad, add this site to your home screen and open it there.'; return; }
		try {
			const response = await fetch('/api/push');
			if (!response.ok) throw new Error('could not load notification settings — reload to try again');
			const state = await response.json(); key = state.k; ready = Boolean(key);
			const registration = await navigator.serviceWorker.getRegistration('/');
			active = Boolean(state.s && await registration?.pushManager.getSubscription());
			message = !ready ? 'browser notifications will be available once publishing setup is complete. your inbox below is ready.' : Notification.permission === 'denied' ? 'notifications are blocked. allow them in your browser site settings to opt in.' : active ? 'browser notifications are on for this device.' : 'get a browser notification when michael shares something new. you can turn this off any time.';
		} catch (cause) { message = (cause as Error).message; }
	});
	async function toggle() {
		busy = true;
		try {
			if (active) {
				const response = await fetch('/api/push', { method: 'DELETE' });
				if (!response.ok) throw new Error('could not turn notifications off — try again');
				const registration = await navigator.serviceWorker.getRegistration('/');
				await (await registration?.pushManager.getSubscription())?.unsubscribe();
				active = false; message = 'browser notifications are off for this device.';
			} else {
				if (await Notification.requestPermission() !== 'granted') { message = 'notifications were not enabled. you can still read every update below.'; return; }
				await navigator.serviceWorker.register('/sw.js');
				const registration = await navigator.serviceWorker.ready;
				const subscription = await registration.pushManager.getSubscription() ?? await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: Uint8Array.from(atob(key.replace(/-/g, '+').replace(/_/g, '/')), (character) => character.charCodeAt(0)) });
				const response = await fetch('/api/push', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(subscription.toJSON()) });
				if (!response.ok) { const result = await response.json(); throw new Error(result.m ?? result.message ?? 'could not enable notifications — try again'); }
				active = true; message = 'browser notifications are on. your first update will arrive when michael sends one.';
			}
		} catch (cause) { message = (cause as Error).message; }
		finally { busy = false; }
	}
</script>

<div class="my-10 border border-plate-3 bg-plate-2 p-6"><h2 class="font-sans text-base">browser notifications</h2><p role="status" class="mt-3 max-w-xl text-sm leading-relaxed text-ash">{message}</p>{#if supported && (ready || active)}<button type="button" disabled={busy} onclick={toggle} class="mt-5 min-h-11 bg-lume px-5 py-3 text-sm text-plate disabled:opacity-50">{busy ? 'updating…' : active ? 'turn off on this device' : 'turn on notifications'}</button>{/if}<p class="mt-4 text-xs leading-relaxed text-ash">opting in stores an anonymous delivery address and encryption keys for this browser. no name or email. turning off removes them; expired addresses are removed when delivery fails.</p></div>
