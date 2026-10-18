import { error, type RequestEvent } from '@sveltejs/kit';

export function same_origin({ request, url }: Pick<RequestEvent, 'request' | 'url'>) {
	if (request.headers.get('origin') !== url.origin) error(403, 'request must come from this site');
}

export async function read_limited(request: Request, limit: number) {
	if (Number(request.headers.get('content-length')) > limit) error(413, 'file or request is too large');
	const reader = request.body?.getReader();
	if (!reader) return new Uint8Array();
	const chunks: Uint8Array[] = [];
	let length = 0;
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			length += value.length;
			if (length > limit) { await reader.cancel(); error(413, 'file or request is too large'); }
			chunks.push(value);
		}
	} finally { reader.releaseLock(); }
	const result = new Uint8Array(length);
	let offset = 0;
	for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
	return result;
}
