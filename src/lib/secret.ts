export type SecretVal = string | { get?: () => Promise<string> };

export async function get_secret(v: SecretVal | undefined | null): Promise<string> {
	if (!v) return '';
	if (typeof v === 'string') return v;
	return (await v.get?.()) ?? '';
}