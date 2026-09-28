import { _ as normalizeIpAddress, v as parseCanonicalIpAddress } from "./ip-CDH5BTTD.mjs";
//#region packages/gateway-client/src/client-address-utils.ts
function normalizeGatewayErrorText(value) {
	return typeof value === "string" ? value.trim().toLowerCase() : "";
}
function isSensitiveUrlQueryParamName(key) {
	return /(?:token|password|secret|key|auth|credential)/iu.test(key);
}
function isGatewayClientStoppedError(err) {
	const message = err instanceof Error ? err.message : String(err);
	return message === "gateway client stopped" || message === "Error: gateway client stopped";
}
function formatGatewayClientErrorForLog(err) {
	return String(err).replace(/\/\/([^@/?#\s]+)@/g, "//***:***@").replace(/(Authorization:\s*Bearer\s+)[^\s]+/giu, "$1***").replace(/([?&])([^=&\s]+)=([^&#\s"'<>)]*)/g, (match, prefix, key) => isSensitiveUrlQueryParamName(key) ? `${prefix}${key}=***` : match);
}
const SHA256_HEX_FINGERPRINT = /^[a-fA-F0-9]{64}$/u;
const SHA256_COLON_FINGERPRINT = /^(?:[a-fA-F0-9]{2}:){31}[a-fA-F0-9]{2}$/u;
function normalizeTlsFingerprint(fingerprint) {
	const value = (fingerprint ?? "").trim().replace(/^sha256:/iu, "");
	if (SHA256_HEX_FINGERPRINT.test(value)) return value.toLowerCase();
	return SHA256_COLON_FINGERPRINT.test(value) ? value.replaceAll(":", "").toLowerCase() : "";
}
function requireTlsFingerprint(fingerprint) {
	const normalized = normalizeTlsFingerprint(fingerprint);
	if (!normalized) throw new Error("Invalid TLS fingerprint; expected a SHA-256 certificate fingerprint.");
	return normalized;
}
function parseHostForAddressChecks(host) {
	if (!host) return null;
	const normalizedHost = host.toLowerCase().trim();
	const canonicalHost = normalizedHost.replace(/\.+$/, "");
	if (canonicalHost === "localhost") return {
		isLocalhost: true,
		unbracketedHost: canonicalHost
	};
	return {
		isLocalhost: false,
		unbracketedHost: normalizedHost.startsWith("[") && normalizedHost.endsWith("]") ? normalizedHost.slice(1, -1) : normalizedHost
	};
}
function parseGatewayIpAddress(host) {
	const normalized = normalizeIpAddress(host);
	return normalized ? parseCanonicalIpAddress(normalized) : void 0;
}
//#endregion
export { parseGatewayIpAddress as a, normalizeTlsFingerprint as i, isGatewayClientStoppedError as n, parseHostForAddressChecks as o, normalizeGatewayErrorText as r, requireTlsFingerprint as s, formatGatewayClientErrorForLog as t };
