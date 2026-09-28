import { t as normalizeHostname } from "./hostname-BEfh3sRX.mjs";
import { d as isPrivateNetworkAllowedByPolicy, p as matchesHostnameAllowlist } from "./ssrf-BQRtcdBp.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
//#region extensions/browser/src/browser/ssrf-policy-helpers.ts
/**
* SSRF policy helpers for Browser routes that need one-off hostname grants.
*/
const discoveredCdpAuthorityChangeByPolicy = /* @__PURE__ */ new WeakMap();
function allowsDiscoveredCdpAuthorityChange(ssrfPolicy) {
	const prepared = ssrfPolicy ? discoveredCdpAuthorityChangeByPolicy.get(ssrfPolicy) : void 0;
	if (prepared !== void 0) return prepared;
	const hasExplicitAllowedHostnames = (ssrfPolicy?.allowedHostnames ?? []).some((hostname) => hostname.trim().length > 0);
	return !ssrfPolicy || !hasExplicitAllowedHostnames && isPrivateNetworkAllowedByPolicy(ssrfPolicy);
}
/** Return true when policy already trusts this hostname as a private-network destination. */
function isCdpHostnameTrustedByPolicy(ssrfPolicy, hostname) {
	const normalizedHostname = normalizeHostname(hostname);
	if (!normalizedHostname) return false;
	const allowedHostnames = (ssrfPolicy?.allowedHostnames ?? []).map((pattern) => normalizeHostname(pattern)).filter(Boolean);
	if (allowedHostnames.length === 0) return isPrivateNetworkAllowedByPolicy(ssrfPolicy);
	if (allowedHostnames.some((pattern) => pattern === "*" || pattern === "*.")) return true;
	return matchesHostnameAllowlist(normalizedHostname, allowedHostnames);
}
/** Return true when the policy blocklist denies this exact CDP hostname. */
function isCdpHostnameBlockedByPolicy(ssrfPolicy, hostname) {
	const normalizedHostname = normalizeHostname(hostname);
	const blockedHostnames = (ssrfPolicy?.blockedHostnames ?? []).map((pattern) => normalizeHostname(pattern)).filter(Boolean);
	if (!normalizedHostname || blockedHostnames.length === 0) return false;
	return matchesHostnameAllowlist(normalizedHostname, blockedHostnames);
}
/** Returns an SSRF policy restricted to one exact control-plane hostname. */
function withExactHostnamePolicy(ssrfPolicy, hostname) {
	const { allowedOrigins: _allowedOrigins, ...basePolicy } = ssrfPolicy ?? {};
	const scopedPolicy = {
		...basePolicy,
		allowedHostnames: [hostname]
	};
	discoveredCdpAuthorityChangeByPolicy.set(scopedPolicy, allowsDiscoveredCdpAuthorityChange(ssrfPolicy));
	return scopedPolicy;
}
//#endregion
export { withExactHostnamePolicy as i, isCdpHostnameBlockedByPolicy as n, isCdpHostnameTrustedByPolicy as r, allowsDiscoveredCdpAuthorityChange as t };
