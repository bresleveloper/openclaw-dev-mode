import { t as normalizeHostname } from "./hostname-BEfh3sRX.mjs";
import { c as BrowserProfileUnavailableError } from "./errors-CXz-2iKA.mjs";
import { t as getBrowserProfileCapabilities } from "./profile-capabilities-B30ig3n7.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
import { i as withExactHostnamePolicy, n as isCdpHostnameBlockedByPolicy, r as isCdpHostnameTrustedByPolicy } from "./ssrf-policy-helpers-BmwvxBcL.mjs";
//#region extensions/browser/src/browser/cdp-reachability-policy.ts
const cdpControlSourcePolicyByScopedPolicy = /* @__PURE__ */ new WeakMap();
function withCdpControlHostname(profile, ssrfPolicy, requireAllowlistMatch = false) {
	const cdpHost = normalizeHostname(profile.cdpHost);
	if (!ssrfPolicy || !cdpHost) return ssrfPolicy;
	if (requireAllowlistMatch && !isCdpHostnameTrustedByPolicy(ssrfPolicy, cdpHost)) return ssrfPolicy;
	const scopedPolicy = withExactHostnamePolicy(ssrfPolicy, cdpHost);
	cdpControlSourcePolicyByScopedPolicy.set(scopedPolicy, ssrfPolicy);
	return scopedPolicy;
}
function hasPolicyEntries(values) {
	return (values ?? []).some((value) => value.trim().length > 0);
}
function requiresPinnedChromeMcpCdpTransport(cdpPolicy, cdpHost) {
	if (!cdpPolicy) return false;
	const policyIntent = cdpControlSourcePolicyByScopedPolicy.get(cdpPolicy) ?? cdpPolicy;
	return !(!(policyIntent.allowRfc2544BenchmarkRange === true || policyIntent.allowIpv6UniqueLocalRange === true || hasPolicyEntries(policyIntent.allowedHostnames) || hasPolicyEntries(policyIntent.hostnameAllowlist) || isCdpHostnameBlockedByPolicy(policyIntent, cdpHost) || hasPolicyEntries(policyIntent.allowedOrigins)) && (policyIntent.dangerouslyAllowPrivateNetwork === true || policyIntent.allowPrivateNetwork === true));
}
function resolveCdpReachabilityPolicy(profile, ssrfPolicy) {
	const capabilities = getBrowserProfileCapabilities(profile);
	if (!capabilities.isRemote && profile.cdpIsLoopback && profile.driver === "openclaw") return;
	return withCdpControlHostname(profile, ssrfPolicy, capabilities.isRemote);
}
/** Alias used by callers that treat reachability and control as one CDP policy. */
const resolveCdpControlPolicy = resolveCdpReachabilityPolicy;
function assertChromeMcpCdpTransportAllowed(profile, cdpPolicy) {
	if (profile.driver !== "existing-session" || !profile.cdpUrl) return;
	if (!requiresPinnedChromeMcpCdpTransport(cdpPolicy, profile.cdpHost)) return;
	throw new BrowserProfileUnavailableError(`Browser profile "${profile.name}" uses Chrome MCP with an explicit CDP endpoint, but the active Browser CDP policy requires OpenClaw to pin the approved endpoint. Chrome MCP cannot carry that pinned transport across its subprocess boundary. Use driver "openclaw" for guarded CDP endpoints, or remove cdpUrl and browserUrl/wsEndpoint mcpArgs from this existing-session profile so Chrome MCP attaches to a host-local Chrome profile.`);
}
//#endregion
export { resolveCdpControlPolicy as n, resolveCdpReachabilityPolicy as r, assertChromeMcpCdpTransportAllowed as t };
