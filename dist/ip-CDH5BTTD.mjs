import { s as __toESM } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as require_ipaddr } from "./ipaddr-DW0YfeGv.mjs";
//#region packages/net-policy/src/ip.ts
var import_ipaddr = /* @__PURE__ */ __toESM(require_ipaddr(), 1);
function expectIpv6Hextets(parts) {
	const [a, b, c, d, e, f, g, h] = parts;
	if (a === void 0 || b === void 0 || c === void 0 || d === void 0 || e === void 0 || f === void 0 || g === void 0 || h === void 0) throw new Error("expected IPv6 address to expose 8 hextets");
	return [
		a,
		b,
		c,
		d,
		e,
		f,
		g,
		h
	];
}
const BLOCKED_IPV4_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
	"unspecified",
	"broadcast",
	"multicast",
	"linkLocal",
	"loopback",
	"carrierGradeNat",
	"private",
	"reserved"
]);
const PRIVATE_OR_LOOPBACK_IPV4_RANGES = /* @__PURE__ */ new Set([
	"loopback",
	"private",
	"linkLocal",
	"carrierGradeNat"
]);
const BLOCKED_IPV6_SPECIAL_USE_RANGES = /* @__PURE__ */ new Set([
	"unspecified",
	"loopback",
	"linkLocal",
	"uniqueLocal",
	"multicast",
	"reserved",
	"benchmarking",
	"discard",
	"orchid2"
]);
const RFC2544_BENCHMARK_PREFIX = [import_ipaddr.default.IPv4.parse("198.18.0.0"), 15];
const CLOUD_METADATA_IP_ADDRESSES = /* @__PURE__ */ new Set(["100.100.100.200", "fd00:ec2::254"]);
function stripIpv6Brackets(value) {
	if (value.startsWith("[") && value.endsWith("]")) return value.slice(1, -1);
	return value;
}
function isNumericIpv4LiteralPart(value) {
	return /^[0-9]+$/.test(value) || /^0x[0-9a-f]+$/i.test(value);
}
/** Type guard for parsed IPv4 addresses. */
function isIpv4Address(address) {
	return address.kind() === "ipv4";
}
/** Type guard for parsed IPv6 addresses. */
function isIpv6Address(address) {
	return address.kind() === "ipv6";
}
function normalizeIpv4MappedAddress(address) {
	if (!isIpv6Address(address)) return address;
	if (!address.isIPv4MappedAddress()) return address;
	return address.toIPv4Address();
}
function normalizeIpParseInput(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return;
	return stripIpv6Brackets(trimmed);
}
/** Parses canonical IPv4/IPv6 literals, rejecting legacy IPv4 shorthand forms. */
function parseCanonicalIpAddress(raw) {
	const normalized = normalizeIpParseInput(raw);
	if (!normalized) return;
	return import_ipaddr.default.IPv4.isValidFourPartDecimal(normalized) || import_ipaddr.default.IPv6.isValid(normalized) ? import_ipaddr.default.parse(normalized) : void 0;
}
/** Parses canonical IP literals plus legacy IPv4 forms needed for SSRF checks. */
function parseLooseIpAddress(raw) {
	const normalized = normalizeIpParseInput(raw);
	if (!normalized) return;
	return import_ipaddr.default.isValid(normalized) ? import_ipaddr.default.parse(normalized) : void 0;
}
/** Normalizes canonical IP literals and maps IPv4-mapped IPv6 addresses to IPv4 text. */
function normalizeIpAddress(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	if (!parsed) return;
	const normalized = normalizeIpv4MappedAddress(parsed);
	return normalizeLowercaseStringOrEmpty(normalized.toString());
}
/** True only for canonical four-part dotted-decimal IPv4 literals. */
function isCanonicalDottedDecimalIPv4(raw) {
	const normalized = normalizeIpParseInput(raw);
	return normalized !== void 0 && import_ipaddr.default.IPv4.isValidFourPartDecimal(normalized);
}
/** Detects legacy numeric IPv4 forms that canonical parsing deliberately rejects. */
function isLegacyIpv4Literal(raw) {
	const trimmed = normalizeOptionalString(raw);
	if (!trimmed) return false;
	const normalized = stripIpv6Brackets(trimmed);
	if (!normalized || normalized.includes(":")) return false;
	if (isCanonicalDottedDecimalIPv4(normalized)) return false;
	const parts = normalized.split(".");
	if (parts.length === 0 || parts.length > 4) return false;
	if (parts.some((part) => part.length === 0)) return false;
	if (!parts.every((part) => isNumericIpv4LiteralPart(part))) return false;
	return true;
}
/** True when a canonical IP literal is loopback, including IPv4-mapped IPv6. */
function isLoopbackIpAddress(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	if (!parsed) return false;
	return normalizeIpv4MappedAddress(parsed).range() === "loopback";
}
/** True for link-local IPs, including legacy and embedded-IPv4 forms. */
function isLinkLocalIpAddress(raw) {
	const parsed = parseLooseIpAddress(raw);
	if (!parsed) return false;
	const normalized = normalizeIpv4MappedAddress(parsed);
	if (isIpv4Address(normalized)) return normalized.range() === "linkLocal";
	if (extractEmbeddedIpv4FromIpv6(normalized)?.range() === "linkLocal") return true;
	return normalized.range() === "linkLocal";
}
/** True for unspecified IPs, including IPv4 embedded in IPv6 transition forms. */
function isUnspecifiedIpAddress(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	if (!parsed || parsed.range() === "loopback") return false;
	return (isIpv6Address(parsed) ? extractEmbeddedIpv4FromIpv6(parsed) ?? parsed : parsed).range() === "unspecified";
}
/** True for cloud metadata IP literals, including mapped and embedded forms. */
function isCloudMetadataIpAddress(raw) {
	const parsed = parseLooseIpAddress(raw);
	if (!parsed) return false;
	const normalized = normalizeIpv4MappedAddress(parsed);
	if (isIpv6Address(normalized)) {
		const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(normalized);
		if (embeddedIpv4 && CLOUD_METADATA_IP_ADDRESSES.has(embeddedIpv4.toString())) return true;
	}
	return CLOUD_METADATA_IP_ADDRESSES.has(normalized.toString());
}
/** True for canonical private, loopback, link-local, or blocked special-use IPs. */
function isPrivateOrLoopbackIpAddress(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	if (!parsed) return false;
	const normalized = normalizeIpv4MappedAddress(parsed);
	if (isIpv4Address(normalized)) return PRIVATE_OR_LOOPBACK_IPV4_RANGES.has(normalized.range());
	if (isBlockedSpecialUseIpv6Address(normalized)) return true;
	const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(normalized);
	return embeddedIpv4 ? PRIVATE_OR_LOOPBACK_IPV4_RANGES.has(embeddedIpv4.range()) : false;
}
/** True for RFC 8215 local-use NAT64 IPv6 literals (`64:ff9b:1::/48`). */
function isRfc8215LocalUseNat64Ipv6Address(raw) {
	const parsed = parseCanonicalIpAddress(raw);
	return Boolean(parsed && isIpv6Address(parsed) && isRfc8215Nat64LocalUseAddress(parsed));
}
/** Applies the SSRF block policy for parsed IPv6 special-use ranges. */
function isBlockedSpecialUseIpv6Address(address, options = {}) {
	const range = address.range();
	if (isRfc8215Nat64LocalUseAddress(address)) return true;
	if (isCloudMetadataIpAddress(address.toString())) return true;
	if (range === "uniqueLocal" && options.allowUniqueLocalRange === true) return false;
	if (BLOCKED_IPV6_SPECIAL_USE_RANGES.has(range)) return true;
	const [firstPart] = expectIpv6Hextets(address.parts);
	return (firstPart & 65472) === 65216;
}
/** True for canonical IPv4 literals in RFC 1918 private ranges. */
function isRfc1918Ipv4Address(raw) {
	return parseCanonicalIpAddress(raw)?.range() === "private";
}
/** True for canonical IPv4 literals in the carrier-grade NAT range. */
function isCarrierGradeNatIpv4Address(raw) {
	return parseCanonicalIpAddress(raw)?.range() === "carrierGradeNat";
}
/** Applies the SSRF block policy for parsed IPv4 special-use ranges. */
function isBlockedSpecialUseIpv4Address(address, options = {}) {
	const inRfc2544BenchmarkRange = address.match(RFC2544_BENCHMARK_PREFIX);
	if (inRfc2544BenchmarkRange && options.allowRfc2544BenchmarkRange === true) return false;
	return BLOCKED_IPV4_SPECIAL_USE_RANGES.has(address.range()) || inRfc2544BenchmarkRange;
}
function decodeIpv4FromHextets(high, low) {
	const octets = [
		high >>> 8 & 255,
		high & 255,
		low >>> 8 & 255,
		low & 255
	];
	return import_ipaddr.default.IPv4.parse(octets.join("."));
}
function isRfc8215Nat64LocalUsePrefix(parts) {
	return parts[0] === 100 && parts[1] === 65435 && parts[2] === 1;
}
function isRfc8215Nat64LocalUseAddress(address) {
	return isRfc8215Nat64LocalUsePrefix(expectIpv6Hextets(address.parts));
}
/** Extracts the embedded IPv4 address from mapped and transition IPv6 prefixes. */
function extractEmbeddedIpv4FromIpv6(address) {
	const parts = expectIpv6Hextets(address.parts);
	switch (address.range()) {
		case "ipv4Mapped": return address.toIPv4Address();
		case "rfc6145": return decodeIpv4FromHextets(parts[6], parts[7]);
		case "rfc6052":
			if (isRfc8215Nat64LocalUseAddress(address)) return;
			return decodeIpv4FromHextets(parts[6], parts[7]);
		case "6to4": return decodeIpv4FromHextets(parts[1], parts[2]);
		case "teredo": return decodeIpv4FromHextets(parts[6] ^ 65535, parts[7] ^ 65535);
	}
	const isIpv4Compatible = parts[0] === 0 && parts[1] === 0 && parts[2] === 0 && parts[3] === 0 && parts[4] === 0 && parts[5] === 0;
	const isIsatap = (parts[4] & 64767) === 0 && parts[5] === 24318;
	if (isIpv4Compatible || isIsatap) return decodeIpv4FromHextets(parts[6], parts[7]);
}
/** Parses the exact-IP and CIDR forms accepted by runtime address matching. */
function parseIpAddressOrCidr(raw) {
	const candidate = normalizeOptionalString(raw);
	if (!candidate) return;
	if (!candidate.includes("/")) {
		const exact = parseCanonicalIpAddress(candidate);
		return exact ? [exact] : void 0;
	}
	try {
		return import_ipaddr.default.parseCIDR(candidate);
	} catch {
		return;
	}
}
/** Checks an IP literal against an exact IP or CIDR range, normalizing mapped IPv4. */
function isIpInCidr(ip, cidr) {
	const normalizedIp = parseCanonicalIpAddress(ip);
	const range = parseIpAddressOrCidr(cidr);
	if (!normalizedIp || !range) return false;
	const [baseAddress, prefixLength] = range;
	const comparableIp = normalizeIpv4MappedAddress(normalizedIp);
	const comparableBase = normalizeIpv4MappedAddress(baseAddress);
	if (prefixLength === void 0) return comparableIp.kind() === comparableBase.kind() && comparableIp.toString() === comparableBase.toString();
	if (isIpv4Address(comparableIp) && isIpv4Address(comparableBase)) {
		const ipv4PrefixLength = isIpv6Address(baseAddress) ? Math.max(0, prefixLength - 96) : prefixLength;
		return comparableIp.match([comparableBase, ipv4PrefixLength]);
	}
	if (isIpv6Address(comparableIp) && isIpv6Address(comparableBase)) return comparableIp.match([comparableBase, prefixLength]);
	return false;
}
//#endregion
export { normalizeIpAddress as _, isCarrierGradeNatIpv4Address as a, parseLooseIpAddress as b, isIpv4Address as c, isLinkLocalIpAddress as d, isLoopbackIpAddress as f, isUnspecifiedIpAddress as g, isRfc8215LocalUseNat64Ipv6Address as h, isCanonicalDottedDecimalIPv4 as i, isIpv6Address as l, isRfc1918Ipv4Address as m, isBlockedSpecialUseIpv4Address as n, isCloudMetadataIpAddress as o, isPrivateOrLoopbackIpAddress as p, isBlockedSpecialUseIpv6Address as r, isIpInCidr as s, extractEmbeddedIpv4FromIpv6 as t, isLegacyIpv4Literal as u, parseCanonicalIpAddress as v, parseIpAddressOrCidr as y };
