<script lang="ts">
	import Hero from '$lib/home/Hero.svelte';
	import Library from '$lib/home/Library.svelte';
	import Close from '$lib/home/Close.svelte';
</script>

<svelte:head>
	<title>Michael Kekong — nine blueprints on the body, the money and the exams</title>
	<meta
		name="description"
		content="Prevention, income and exam blueprints by Michael Kekong. Instant PDF delivery, paid with card, transfer, USSD, Opay or PalmPay."
	/>
	<meta
		property="og:title"
		content="Michael Kekong — nine blueprints on the body, the money and the exams"
	/>
	<meta
		property="og:description"
		content="Prevention, income and exam blueprints by Michael Kekong. Instant PDF delivery, paid with card, transfer, USSD, Opay or PalmPay."
	/>
</svelte:head>

<Hero />

<section class="mx-auto mb-24 max-w-[88rem] border-y border-plate-3 px-5 py-10 sm:px-8"><div class="flex flex-wrap items-end justify-between gap-6"><div><p class="font-mono text-xs tracking-widest text-lume">in between the books</p><h2 class="mt-4 text-big">a thought. a read. a few minutes on camera.</h2></div><a href="/updates" class="inline-block border border-lume px-6 py-3 text-sm text-lume hover:bg-lume hover:text-plate">from the desk ↗</a></div></section>

<Library />

<Close />
