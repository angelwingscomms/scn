import type { Action } from 'svelte/action';

export const ctrl_enter: Action<HTMLElement, () => void> = (node, run) => {
	let go = run;
	const key = (e: KeyboardEvent) => {
		if (e.key !== 'Enter' || !(e.ctrlKey || e.metaKey)) return;
		e.preventDefault();
		go();
	};
	node.addEventListener('keydown', key);
	return {
		update: (next: () => void) => (go = next),
		destroy: () => node.removeEventListener('keydown', key)
	};
};