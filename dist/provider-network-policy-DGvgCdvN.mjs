import { d as isLinkLocalIpAddress, h as isRfc8215LocalUseNat64Ipv6Address, o as isCloudMetadataIpAddress, v as parseCanonicalIpAddress } from "./ip-Df-yvQzE.mjs";
import { _ as ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist, d as mergeSsrFPolicies, g as ssrfPolicyFromHttpBaseUrlAllowedOrigin, t as SsrFBlockedError } from "./ssrf-K50Tjeok.mjs";
//#region src/agents/provider-network-policy.ts
const BLOCKED_EXACT_ORIGIN_TRUST_HOSTNAME_LABELS = /* @__PURE__ */ new Set(["instance-data"]);
function resolveHttpOrigin(value) {
	if (typeof value !== "string" || !value.trim()) return;
	const parsed = URL.parse(value);
	if (!parsed || parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
	parsed.hostname = parsed.hostname.replace(/\.+$/, "");
	return parsed.origin.toLowerCase();
}
function normalizeProviderOriginHostname(value) {
	if (typeof value !== "string" || !value.trim()) return;
	const parsed = URL.parse(value);
	if (!parsed || parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
	return parsed.hostname.trim().toLowerCase().replace(/\.+$/, "") || void 0;
}
function resolveProviderTransportSsrFPolicy(params) {
	const baseUrl = params.baseUrl;
	const baseOrigin = resolveHttpOrigin(baseUrl);
	const requestOrigin = resolveHttpOrigin(params.url);
	const requestMatchesBaseOrigin = typeof baseUrl === "string" && Boolean(baseOrigin) && requestOrigin === baseOrigin;
	const hostname = requestMatchesBaseOrigin ? normalizeProviderOriginHostname(baseUrl) : void 0;
	const eligibleHostname = hostname && !hostname.split(".").filter(Boolean).some((label) => label.includes("metadata") || BLOCKED_EXACT_ORIGIN_TRUST_HOSTNAME_LABELS.has(label));
	const baseUrlOriginPolicy = requestMatchesBaseOrigin && params.trustConfiguredBaseUrlOrigin && eligibleHostname && !isLinkLocalIpAddress(hostname) && !isCloudMetadataIpAddress(hostname) && !isRfc8215LocalUseNat64Ipv6Address(hostname) ? ssrfPolicyFromHttpBaseUrlAllowedOrigin(baseUrl) : void 0;
	const fakeIpPolicy = requestMatchesBaseOrigin && eligibleHostname && !parseCanonicalIpAddress(hostname) ? ssrfPolicyFromHttpBaseUrlFakeIpHostnameAllowlist(baseUrl) : void 0;
	return mergeSsrFPolicies(baseUrlOriginPolicy, fakeIpPolicy, params.allowPrivateNetwork ? { allowPrivateNetwork: true } : void 0);
}
function withModelProviderNetworkRemediation(error, params) {
	const baseOrigin = resolveHttpOrigin(params.baseUrl);
	const requestOrigin = resolveHttpOrigin(params.url);
	const hostname = normalizeProviderOriginHostname(params.baseUrl);
	if (!(error instanceof SsrFBlockedError) || !baseOrigin || requestOrigin !== baseOrigin || !hostname || !isRfc8215LocalUseNat64Ipv6Address(hostname)) return error;
	return new SsrFBlockedError(`Configured model provider ${params.providerId} uses local-use NAT64 origin ${baseOrigin}, which OpenClaw blocks by default. Move the provider to a loopback, LAN, or tailnet address, or set models.providers.${params.providerId}.request.allowPrivateNetwork=true only for an operator-controlled endpoint. Original block: ${error.message}`);
}
//#endregion
export { withModelProviderNetworkRemediation as n, resolveProviderTransportSsrFPolicy as t };
