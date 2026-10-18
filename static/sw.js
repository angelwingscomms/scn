self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('push', (event) => {
	let note = {};
	try { note = event.data?.json() ?? {}; } catch { /* Show a useful fallback for an empty or invalid payload. */ }
	const path = typeof note.u === 'string' && /^\/updates\/[a-f0-9-]{36}$/.test(note.u) ? note.u : '/notifications';
	event.waitUntil(self.registration.showNotification(typeof note.t === 'string' ? note.t : 'a note from michael kekong', {
		body: typeof note.b === 'string' ? note.b : 'there is something new from the desk.',
		icon: '/favicon.svg',
		tag: typeof note.i === 'string' ? note.i : 'kekong-update',
		data: { u: path }
	}));
});
self.addEventListener('notificationclick', (event) => {
	event.notification.close();
	const path = event.notification.data?.u;
	const target = new URL(typeof path === 'string' && /^\/updates\/[a-f0-9-]{36}$/.test(path) ? path : '/notifications', self.location.origin).href;
	event.waitUntil((async () => {
		const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
		const existing = clients.find((client) => client.url === target);
		if (existing) return existing.focus();
		return self.clients.openWindow(target);
	})());
});
