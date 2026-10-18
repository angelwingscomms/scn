<script lang="ts">
	import { enhance } from '$app/forms';
	import { beforeNavigate } from '$app/navigation';
	import { untrack } from 'svelte';
	import { kinds, media_limit, type Post } from '$lib/content';
	let { p, m = '' }: { p: Post; m?: string } = $props();
	let post = $state<Post>(untrack(() => ({ ...p })));
	let dirty = $state(false);
	let busy = $state(false);
	let progress = $state(0);
	let upload_message = $state('');
	let video_file = $state<HTMLInputElement>();
	$effect(() => { post = { ...p }; dirty = false; });
	beforeNavigate((navigation) => { if (dirty && !busy && !window.confirm('leave without saving your changes?')) navigation.cancel(); });
	function before_unload(event: BeforeUnloadEvent) { if (dirty) { event.preventDefault(); event.returnValue = ''; } }
	async function upload() {
		const file = video_file?.files?.[0];
		if (!file) return;
		upload_message = '';
		if (file.size > media_limit || !['video/mp4', 'video/webm'].includes(file.type)) { upload_message = 'choose an mp4 or webm video up to 27 mb'; return; }
		busy = true; progress = 0;
		try {
			post.v = await new Promise<string>((resolve, reject) => {
				const request = new XMLHttpRequest();
				request.open('POST', `/api/media?i=${post.i}`);
				request.setRequestHeader('content-type', file.type);
				request.upload.onprogress = (event) => { if (event.lengthComputable) progress = Math.round(event.loaded / event.total * 100); };
				request.onerror = () => reject(new Error('upload interrupted — try again'));
				request.timeout = 5 * 60000;
				request.ontimeout = () => reject(new Error('upload timed out — try again'));
				request.onload = () => { try { const result = JSON.parse(request.responseText); if (request.status === 201) resolve(result.i); else reject(new Error(result.message ?? 'upload failed')); } catch { reject(new Error('upload failed — try again')); } };
				request.send(file);
			});
			dirty = true; upload_message = 'video uploaded — save your changes to attach it';
		} catch (cause) { upload_message = (cause as Error).message; }
		finally { busy = false; }
	}
</script>

<svelte:window onbeforeunload={before_unload} />

<form method="POST" action="?/save" class="space-y-6" oninput={() => dirty = true} use:enhance={() => { busy = true; return async ({ update, result }) => { if (result.type === 'redirect' || result.type === 'success') dirty = false; await update({ reset: false }); busy = false; }; }}>
	<input type="hidden" name="i" value={post.i} />
	<input type="hidden" name="e" value={post.e} />
	<input type="hidden" name="v" value={post.v} />
	{#if m}<p role="alert" class="border border-ember bg-plate-2 p-4 text-sm text-bone">{m}</p>{/if}
	<div class="grid gap-5 sm:grid-cols-2">
		<label class="grid gap-2 text-sm">post type<select name="k" bind:value={post.k} class="border border-plate-3 bg-plate px-3 py-3">{#each Object.entries(kinds) as [key, label]}<option value={key}>{label}</option>{/each}</select></label>
		<label class="grid gap-2 text-sm">visibility<select name="d" bind:value={post.d} class="border border-plate-3 bg-plate px-3 py-3"><option value="d">draft — only you can see it</option><option value="p">published — everyone can see it</option></select></label>
	</div>
	<label class="grid gap-2 text-sm">title<input name="t" bind:value={post.t} required maxlength="180" class="border border-plate-3 bg-plate px-3 py-3 text-lg" /></label>
	<label class="grid gap-2 text-sm">summary <span class="text-xs text-ash">optional · appears in the feed and notification</span><textarea name="s" bind:value={post.s} maxlength="300" rows="2" class="resize-y border border-plate-3 bg-plate px-3 py-3"></textarea></label>
	{#if post.k === 'v'}
		<div class="space-y-3 border border-plate-3 bg-plate-2 p-5">
			<p class="text-sm">video · mp4 or webm · up to 27 mb</p>
			{#if !post.e}<p class="text-sm text-ash">save this draft first, then choose your video.</p>{:else}
				<label class="grid gap-2 text-sm">choose video<input bind:this={video_file} type="file" accept="video/mp4,video/webm" disabled={busy} onchange={upload} class="w-full text-sm file:mr-4 file:border file:border-plate-3 file:bg-plate file:px-4 file:py-3" /></label>
			{/if}
			{#if busy && progress > 0}<progress value={progress} max="100" class="w-full" aria-label="video upload progress"></progress><p class="text-xs text-ash">{progress}% uploaded</p>{/if}
			{#if upload_message}<p role="status" class="text-sm">{upload_message}</p>{/if}
			{#if post.v}<a href="/media/{post.v}" target="_blank" rel="noopener" class="text-sm text-lume underline">preview uploaded video</a>{/if}
		</div>
	{/if}
	<label class="grid gap-2 text-sm">{post.k === 'v' ? 'video description' : 'post'}<span class="text-xs text-ash">plain text · separate paragraphs with a blank line</span><textarea name="b" bind:value={post.b} rows={post.k === 'b' ? 18 : 6} maxlength={post.k === 'b' ? 50000 : 1800} class="resize-y border border-plate-3 bg-plate px-3 py-3 leading-relaxed"></textarea><span class="text-right text-xs text-ash">{post.b.length} / {post.k === 'b' ? '50000' : '1800'}</span></label>
	{#if post.k === 'v'}<label class="grid gap-2 text-sm">video transcript <span class="text-xs text-ash">include the spoken words so everyone can follow along</span><textarea name="c" bind:value={post.c} rows="6" maxlength="50000" class="resize-y border border-plate-3 bg-plate px-3 py-3"></textarea></label>{/if}
	<div class="flex flex-wrap items-center gap-4">
		<button type="submit" disabled={busy} class="min-h-11 bg-lume px-6 py-3 text-sm text-plate disabled:opacity-50">{busy ? 'saving…' : post.d === 'p' ? 'save and publish' : 'save draft'}</button>
		{#if post.e}<a href="/updates/{post.i}" target="_blank" rel="noopener" class="px-2 py-3 text-sm text-lume underline">{post.d === 'd' ? 'preview saved draft' : 'view post'}</a>{/if}
		<p class="text-xs text-ash" aria-live="polite">{dirty ? 'unsaved changes' : post.e ? 'saved' : 'new draft'}</p>
	</div>
</form>
{#if post.e}
	<form method="POST" action="?/remove" class="mt-10 border-t border-plate-3 pt-6" onsubmit={(event) => { if (!window.confirm('permanently delete this post and its current video?')) event.preventDefault(); else dirty = false; }}>
		<input type="hidden" name="i" value={post.i} /><input type="hidden" name="e" value={post.e} />
		<button class="min-h-11 text-sm text-ember underline" type="submit">delete post</button>
	</form>
{/if}
