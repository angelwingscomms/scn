import type { Action } from 'svelte/action';

const still = () =>
	typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const light: Action<HTMLElement> = (node) => {
	if (still()) return;

	let target_x = node.clientWidth / 2;
	let target_y = node.clientHeight * 0.44;
	let x = target_x;
	let y = target_y;
	let idle = 0;
	let drift = 0;
	let frame = 0;

	const aim = (e: PointerEvent) => {
		const box = node.getBoundingClientRect();
		target_x = e.clientX - box.left;
		target_y = e.clientY - box.top;
		idle = 0;
	};

	const step = () => {
		idle += 1;
		if (idle > 120) {
			drift += 0.0055;
			target_x = node.clientWidth * (0.5 + 0.32 * Math.sin(drift));
			target_y = node.clientHeight * (0.46 + 0.26 * Math.sin(drift * 1.618));
		}
		x += (target_x - x) * 0.07;
		y += (target_y - y) * 0.07;
		node.style.setProperty('--mx', `${x}px`);
		node.style.setProperty('--my', `${y}px`);
		frame = requestAnimationFrame(step);
	};

	const onscreen = new IntersectionObserver((records) => {
		cancelAnimationFrame(frame);
		if (records[records.length - 1].isIntersecting) frame = requestAnimationFrame(step);
	});

	node.addEventListener('pointermove', aim, { passive: true });
	onscreen.observe(node);

	return {
		destroy() {
			cancelAnimationFrame(frame);
			onscreen.disconnect();
			node.removeEventListener('pointermove', aim);
		}
	};
};

let watcher: IntersectionObserver | null = null;

export const develop: Action<HTMLElement> = (node) => {
	if (still()) return;
	node.dataset.dev = '0';
	watcher ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				(entry.target as HTMLElement).dataset.dev = '1';
				watcher?.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
	);
	watcher.observe(node);
	return { destroy: () => watcher?.unobserve(node) };
};