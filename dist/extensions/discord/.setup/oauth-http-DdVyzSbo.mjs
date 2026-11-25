import { n as getDiscordEndpointRuntime } from "./endpoint-runtime-BM3x-m6O.mjs";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import { readProviderJsonResponse } from "openclaw/plugin-sdk/provider-http";
// extensions/discord/src/oauth-http.ts
const DISCORD_HOST = "discord.com";
const DISCORD_OAUTH_REQUEST_TIMEOUT_MS = 15e3;
const JSON_MAX_BYTES = 65536;
async function fetchDiscordJson(params) {
	const endpoint = Object.hasOwn(params, "endpointRuntime") ? params.endpointRuntime : getDiscordEndpointRuntime();
	const liveUrl = new URL(params.url);
	const endpointPath = liveUrl.pathname === "/api/oauth2/token" ? "/oauth2/token" : liveUrl.pathname.startsWith("/api/v10/") ? liveUrl.pathname.slice(8) : void 0;
	if (endpoint && !endpointPath) throw new Error("Discord request is outside the configured endpoint routes");
	const { response, release } = endpoint ? {
		response: await endpoint.fetch(`${endpoint.descriptor.restApiBaseUrl}${endpointPath}${liveUrl.search}`, {
			...params.init,
			signal: params.init.signal ? AbortSignal.any([params.init.signal, AbortSignal.timeout(DISCORD_OAUTH_REQUEST_TIMEOUT_MS)]) : AbortSignal.timeout(DISCORD_OAUTH_REQUEST_TIMEOUT_MS)
		}),
		release: async () => {}
	} : await fetchWithSsrFGuard({
		url: params.url,
		fetchImpl: params.fetchImpl,
		init: params.init,
		policy: { allowedHostnames: [DISCORD_HOST] },
		auditContext: params.auditContext,
		timeoutMs: DISCORD_OAUTH_REQUEST_TIMEOUT_MS
	});
	try {
		if (!response.ok) {
			await response.body?.cancel().catch(() => void 0);
			return { ok: false };
		}
		return {
			ok: true,
			body: await readProviderJsonResponse(response, "Discord OAuth", { maxBytes: JSON_MAX_BYTES })
		};
	} finally {
		await release();
	}
}
export { fetchDiscordJson as t };
