import { danger } from "openclaw/plugin-sdk/runtime-env";
import { normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { makeProxyFetch } from "openclaw/plugin-sdk/fetch-runtime";
// extensions/discord/src/proxy-fetch.ts
function resolveDiscordProxyFetchForAccount(account, cfg) {
	return withValidatedDiscordProxy(normalizeOptionalString(account.config.proxy) ?? normalizeOptionalString(cfg?.channels?.discord?.proxy), void 0, makeProxyFetch);
}
function withValidatedDiscordProxy(proxyUrl, runtime, createValue) {
	const proxy = proxyUrl?.trim();
	if (!proxy) return;
	try {
		validateDiscordProxyUrl(proxy);
		return createValue(proxy);
	} catch (err) {
		runtime?.error?.(danger(`discord: invalid rest proxy: ${String(err)}`));
		return;
	}
}
function validateDiscordProxyUrl(proxyUrl) {
	let parsed;
	try {
		parsed = new URL(proxyUrl);
	} catch {
		throw new Error("Proxy URL must be a valid http or https URL");
	}
	if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Proxy URL must use http or https");
	return proxyUrl;
}
export { validateDiscordProxyUrl as n, withValidatedDiscordProxy as r, resolveDiscordProxyFetchForAccount as t };
