import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as readResponseWithLimit } from "./http-response-body-B70cE6fn.mjs";
import { h as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-K50Tjeok.mjs";
import { i as fetchWithSsrFGuard, s as withTrustedEnvProxyGuardedFetchMode } from "./fetch-guard-DRapCKeS.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./fetch-runtime-Dg4wMDiG.mjs";
import "./response-limit-runtime-obgw0EAQ.mjs";
import "./ssrf-runtime-z2wN0VZP.mjs";
import { t as parseClawRouterPool } from "./pool-CNxCU8Hq.mjs";
import { o as normalizeClawRouterRootUrl } from "./provider-catalog-vUDZB1bL.mjs";
//#region extensions/clawrouter/pool-gateway.ts
const TIMEOUT_MS = 1e4;
const MAX_BYTES = 1048576;
const unavailable = () => ({
	status: "unavailable",
	message: "ClawRouter pool status is unavailable. Check the ClawRouter connection and try Refresh."
});
async function readJson(response) {
	const bytes = await readResponseWithLimit(response, MAX_BYTES, { chunkTimeoutMs: TIMEOUT_MS });
	return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
function registerClawRouterPoolMethod(api) {
	api.registerGatewayMethod("clawrouter.pool.get", async (request) => {
		const config = request.context.getRuntimeConfig();
		const signal = request.signal;
		const current = () => {
			signal?.throwIfAborted();
			request.client?.connectionSignal?.throwIfAborted();
			if (request.hasCurrentClientAuthority?.() === false) throw new Error("Retired pool request");
		};
		let result;
		try {
			current();
			const { resolveApiKeyForProvider } = await import("./plugin-sdk/provider-auth-runtime.js");
			let token;
			try {
				token = (await resolveApiKeyForProvider({
					provider: "clawrouter",
					cfg: config,
					signal
				}))?.apiKey;
			} catch {}
			current();
			if (!token) result = {
				status: "not_configured",
				message: "Configure a ClawRouter key in Model Providers, then try Refresh."
			};
			else {
				const baseUrl = normalizeClawRouterRootUrl(config.models?.providers?.clawrouter?.baseUrl);
				const { response, release } = await fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode({
					url: `${baseUrl}/v1/pool`,
					init: { headers: {
						Accept: "application/json",
						Authorization: `Bearer ${token}`
					} },
					timeoutMs: TIMEOUT_MS,
					signal,
					policy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
					auditContext: "clawrouter.pool"
				}));
				try {
					if (response.status === 401 || response.status === 403) result = {
						status: "unauthorized",
						message: "The ClawRouter key was rejected. Check or replace it in Model Providers."
					};
					else if (response.status === 404) {
						const body = asOptionalRecord(await readJson(response).catch(() => void 0));
						const error = asOptionalRecord(body?.error);
						result = body?.code === "pool_status_hidden" || error?.code === "pool_status_hidden" || body?.error === "pool_status_hidden" ? {
							status: "hidden",
							message: "Ask your ClawRouter admin to enable pool status for this policy."
						} : {
							status: "unsupported",
							message: "This ClawRouter deployment does not expose pool status. Ask your admin to update ClawRouter."
						};
					} else if (response.status === 405) result = {
						status: "unsupported",
						message: "This ClawRouter deployment does not expose pool status. Ask your admin to update ClawRouter."
					};
					else if (!response.ok) result = unavailable();
					else {
						const pool = parseClawRouterPool(await readJson(response));
						result = pool ? {
							status: "ok",
							pool
						} : unavailable();
					}
				} finally {
					response.body?.cancel().catch(() => void 0);
					await release();
				}
			}
			current();
		} catch {
			result = unavailable();
		}
		request.respond(true, result);
	}, { scope: "operator.read" });
}
//#endregion
export { registerClawRouterPoolMethod as t };
