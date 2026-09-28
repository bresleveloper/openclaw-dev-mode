import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { h as normalizeUniqueStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { _ as resolvePinnedHostnameWithPolicy, c as isBlockedHostnameOrIp, u as isPrivateIpAddress } from "./ssrf-BQRtcdBp.mjs";
import "./legacy-private-network-migration-qYG07znx.mjs";
//#region src/plugin-sdk/ssrf-policy.ts
/** Reads current and legacy private-network opt-in shapes from channel config. */
function isPrivateNetworkOptInEnabled(input) {
	if (input === true) return true;
	const record = asNullableRecord(input);
	if (!record) return false;
	const network = asNullableRecord(record.network);
	return record.allowPrivateNetwork === true || record.dangerouslyAllowPrivateNetwork === true || network?.allowPrivateNetwork === true || network?.dangerouslyAllowPrivateNetwork === true;
}
/** Converts channel private-network opt-in config into the shared SSRF policy shape. */
function ssrfPolicyFromPrivateNetworkOptIn(input) {
	return isPrivateNetworkOptInEnabled(input) ? { allowPrivateNetwork: true } : void 0;
}
/** Compatibility wrapper for callers that already use the canonical dangerous flag name. */
function ssrfPolicyFromDangerouslyAllowPrivateNetwork(dangerouslyAllowPrivateNetwork) {
	return ssrfPolicyFromPrivateNetworkOptIn(dangerouslyAllowPrivateNetwork);
}
/** @deprecated Use `ssrfPolicyFromDangerouslyAllowPrivateNetwork`. */
function ssrfPolicyFromAllowPrivateNetwork(allowPrivateNetwork) {
	return ssrfPolicyFromDangerouslyAllowPrivateNetwork(allowPrivateNetwork);
}
/** Allows cleartext HTTP only when the target is loopback/private or DNS-pins to private IPs. */
async function assertHttpUrlTargetsPrivateNetwork(url, params = {}) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		const err = /* @__PURE__ */ new TypeError("Invalid URL");
		err.code = "ERR_INVALID_URL";
		throw err;
	}
	if (parsed.protocol !== "http:") return;
	const errorMessage = params.errorMessage ?? "HTTP URL must target a trusted private/internal host";
	const { hostname } = parsed;
	if (!hostname) throw new Error(errorMessage);
	if (isBlockedHostnameOrIp(hostname)) return;
	if ((typeof params.dangerouslyAllowPrivateNetwork === "boolean" ? params.dangerouslyAllowPrivateNetwork : params.allowPrivateNetwork) !== true) throw new Error(errorMessage);
	if (!(await resolvePinnedHostnameWithPolicy(hostname, {
		lookupFn: params.lookupFn,
		signal: params.signal,
		policy: ssrfPolicyFromDangerouslyAllowPrivateNetwork(true)
	})).addresses.every((address) => isPrivateIpAddress(address))) throw new Error(errorMessage);
}
function normalizeHostnameSuffix(value) {
	const trimmed = normalizeLowercaseStringOrEmpty(value);
	if (!trimmed) return "";
	if (trimmed === "*" || trimmed === "*.") return "*";
	return trimmed.replace(/^\*\.?/, "").replace(/^\.+/, "").replace(/\.+$/, "");
}
function isHostnameAllowedBySuffixAllowlist(hostname, allowlist) {
	if (allowlist.includes("*")) return true;
	const normalized = normalizeLowercaseStringOrEmpty(hostname);
	return allowlist.some((entry) => normalized === entry || normalized.endsWith(`.${entry}`));
}
/** Normalize suffix-style host allowlists into lowercase canonical entries with wildcard collapse. */
function normalizeHostnameSuffixAllowlist(input, defaults) {
	const source = input && input.length > 0 ? input : defaults;
	if (!source || source.length === 0) return [];
	const normalized = normalizeUniqueStringEntries(source.map(normalizeHostnameSuffix));
	if (normalized.includes("*")) return ["*"];
	return normalized;
}
/** Check whether a URL is HTTPS and its hostname matches the normalized suffix allowlist. */
function isHttpsUrlAllowedByHostnameSuffixAllowlist(url, allowlist) {
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "https:") return false;
		return isHostnameAllowedBySuffixAllowlist(parsed.hostname, allowlist);
	} catch {
		return false;
	}
}
/**
* Converts suffix-style host allowlists (for example "example.com") into SSRF
* hostname allowlist patterns used by the shared fetch guard.
*
* Suffix semantics:
* - "example.com" allows "example.com" and "*.example.com"
* - "*" disables hostname allowlist restrictions
*/
function buildHostnameAllowlistPolicyFromSuffixAllowlist(allowHosts) {
	const normalizedAllowHosts = normalizeHostnameSuffixAllowlist(allowHosts);
	if (normalizedAllowHosts.length === 0) return;
	const patterns = /* @__PURE__ */ new Set();
	for (const normalized of normalizedAllowHosts) {
		if (normalized === "*") return;
		patterns.add(normalized);
		patterns.add(`*.${normalized}`);
	}
	if (patterns.size === 0) return;
	return { hostnameAllowlist: Array.from(patterns) };
}
//#endregion
export { normalizeHostnameSuffixAllowlist as a, ssrfPolicyFromPrivateNetworkOptIn as c, isPrivateNetworkOptInEnabled as i, buildHostnameAllowlistPolicyFromSuffixAllowlist as n, ssrfPolicyFromAllowPrivateNetwork as o, isHttpsUrlAllowedByHostnameSuffixAllowlist as r, ssrfPolicyFromDangerouslyAllowPrivateNetwork as s, assertHttpUrlTargetsPrivateNetwork as t };
