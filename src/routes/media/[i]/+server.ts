import { bucket, owner } from '$lib/server/auth';
import { serve_media } from '$lib/server/content';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => serve_media(bucket(event), event.params.i, event.request, await owner(event));
export const HEAD = GET;
