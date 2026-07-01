//#region src/cron/webhook-url.ts
/** Normalizes cron webhook destination URLs. */
function isAllowedWebhookProtocol(protocol) {
	return protocol === "http:" || protocol === "https:";
}
/** Normalizes cron webhook URLs while rejecting empty, malformed, and non-HTTP(S) values. */
function normalizeHttpWebhookUrl(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	if (!trimmed) return null;
	try {
		if (!isAllowedWebhookProtocol(new URL(trimmed).protocol)) return null;
		return trimmed;
	} catch {
		return null;
	}
}
//#endregion
export { normalizeHttpWebhookUrl as t };
