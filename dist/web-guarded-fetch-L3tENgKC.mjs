import { h as finiteSecondsToTimerSafeMilliseconds } from "./number-coercion-CkhMiRw8.mjs";
import { u as readPositiveIntegerParam } from "./common-BofcG96e.mjs";
import { _ as ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist } from "./ssrf-K50Tjeok.mjs";
import { i as fetchWithSsrFGuard, o as withStrictGuardedFetchMode, s as withTrustedEnvProxyGuardedFetchMode } from "./fetch-guard-DRapCKeS.mjs";
//#region src/agents/tools/web-guarded-fetch.ts
const WEB_TOOLS_SELF_HOSTED_NETWORK_SSRF_POLICY = {
	dangerouslyAllowPrivateNetwork: true,
	allowRfc2544BenchmarkRange: true,
	allowIpv6UniqueLocalRange: true
};
function resolveTimeoutMs(params) {
	const timeoutMs = readPositiveIntegerParam(params, "timeoutMs");
	if (timeoutMs !== void 0) return timeoutMs;
	const timeoutSeconds = readPositiveIntegerParam(params, "timeoutSeconds");
	return timeoutSeconds === void 0 ? void 0 : finiteSecondsToTimerSafeMilliseconds(timeoutSeconds, { floorSeconds: true });
}
/** Runs a guarded fetch with strict or trusted-env-proxy web tool policy. */
async function fetchWithWebToolsNetworkGuard(params) {
	const { timeoutSeconds, useEnvProxy, ...rest } = params;
	const resolved = {
		...rest,
		timeoutMs: resolveTimeoutMs({
			timeoutMs: rest.timeoutMs,
			timeoutSeconds
		})
	};
	return fetchWithSsrFGuard(useEnvProxy ? withTrustedEnvProxyGuardedFetchMode(resolved) : withStrictGuardedFetchMode(resolved));
}
async function withWebToolsNetworkGuard(params, run, trustedPolicy) {
	const { response, finalUrl, release } = await fetchWithWebToolsNetworkGuard(trustedPolicy ? {
		...params,
		policy: trustedPolicy,
		useEnvProxy: true
	} : params);
	try {
		return await run({
			response,
			finalUrl
		});
	} finally {
		await release();
	}
}
/** Runs a fetch for trusted endpoints, allowing env proxy with pinned-host policy. */
async function withTrustedWebToolsEndpoint(params, run) {
	return await withWebToolsNetworkGuard(params, run, ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist(params.url) ?? {});
}
/** Runs a fetch for configured self-hosted endpoints with private-network access allowed. */
async function withSelfHostedWebToolsEndpoint(params, run) {
	return await withWebToolsNetworkGuard(params, run, WEB_TOOLS_SELF_HOSTED_NETWORK_SSRF_POLICY);
}
/** Runs a fetch under strict SSRF protection without env proxy trust. */
async function withStrictWebToolsEndpoint(params, run) {
	return await withWebToolsNetworkGuard(params, run);
}
//#endregion
export { withTrustedWebToolsEndpoint as i, withSelfHostedWebToolsEndpoint as n, withStrictWebToolsEndpoint as r, fetchWithWebToolsNetworkGuard as t };
