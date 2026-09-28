import { t as stableStringify } from "./stable-stringify-CkQ0IEj1.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
//#region src/gateway/auth-policy.ts
const generations = /* @__PURE__ */ new WeakMap();
/** Session authority follows immutable runtime snapshots, independently of durable device tokens. */
function resolveGatewayAuthPolicyGeneration(config) {
	let generation = generations.get(config);
	if (generation === void 0) {
		const gateway = config.gateway;
		const trustedProxy = gateway?.auth?.trustedProxy;
		generation = stableStringify({
			roles: gateway?.roles,
			trustedProxies: gateway?.trustedProxies?.toSorted(),
			allowRealIpFallback: gateway?.allowRealIpFallback,
			allowTailscale: gateway?.auth?.allowTailscale,
			identityScopes: gateway?.auth?.identityScopes,
			trustedProxy: trustedProxy && {
				...trustedProxy,
				requiredHeaders: (trustedProxy.requiredHeaders ?? []).toSorted(),
				allowUsers: (trustedProxy.allowUsers ?? []).toSorted()
			}
		});
		generations.set(config, generation);
	}
	return generation;
}
function isGatewayAuthPolicyCurrent(generation, config) {
	if (generation === void 0) return true;
	const current = config === void 0 ? getRuntimeConfig() : config;
	return current !== null && resolveGatewayAuthPolicyGeneration(current) === generation;
}
//#endregion
export { resolveGatewayAuthPolicyGeneration as n, isGatewayAuthPolicyCurrent as t };
