import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as isHttpUrl } from "./url-protocol-De2aQ55s.mjs";
//#region src/cron/webhook-url.ts
/** Normalizes cron webhook URLs while rejecting empty, malformed, and non-HTTP(S) values. */
function normalizeHttpWebhookUrl(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return null;
	const parsed = URL.parse(trimmed);
	return parsed && isHttpUrl(parsed) && !parsed.username && !parsed.password ? trimmed : null;
}
//#endregion
export { normalizeHttpWebhookUrl as t };
