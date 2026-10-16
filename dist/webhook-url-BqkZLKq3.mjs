import { n as isHttpUrl } from "./url-protocol-OU3K-ySz.mjs";
//#region src/cron/webhook-url.ts
/** Normalizes cron webhook URLs while rejecting empty, malformed, and non-HTTP(S) values. */
function normalizeHttpWebhookUrl(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	try {
		const parsed = new URL(trimmed);
		if (!isHttpUrl(parsed) || parsed.username || parsed.password) return null;
	} catch {
		return null;
	}
	return trimmed;
}
//#endregion
export { normalizeHttpWebhookUrl as t };
