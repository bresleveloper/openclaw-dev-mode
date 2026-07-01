import ipaddr from "ipaddr.js";
/** Parsed IP address value returned by the net-policy parsing helpers. */
export type ParsedIpAddress = ipaddr.IPv4 | ipaddr.IPv6;
/** Per-call exemptions for `isBlockedSpecialUseIpv4Address`. */
export type Ipv4SpecialUseBlockOptions = {
    allowRfc2544BenchmarkRange?: boolean;
};
/**
 * Per-call exemptions for `isBlockedSpecialUseIpv6Address`. Mirror of
 * {@link Ipv4SpecialUseBlockOptions} for the IPv6 side. Currently only
 * `allowUniqueLocalRange` is exposed (#74351); other reserved IPv6 ranges stay
 * unconditionally blocked because they have no documented fake-ip / proxy
 * use case.
 */
export type Ipv6SpecialUseBlockOptions = {
    /**
     * When true, exempt addresses in `fc00::/7` (the IPv6 Unique Local Address
     * block, RFC 4193) from the SSRF private-IP block. Sing-box / Clash / Surge
     * fake-ip implementations resolve foreign domains to ULA addresses
     * alongside RFC 2544 benchmark IPv4 addresses, and operators using those
     * proxy stacks need both ranges exempted to keep `web_fetch` working.
     */
    allowUniqueLocalRange?: boolean;
};
/** Type guard for parsed IPv4 addresses. */
export declare function isIpv4Address(address: ParsedIpAddress): address is ipaddr.IPv4;
/** Type guard for parsed IPv6 addresses. */
export declare function isIpv6Address(address: ParsedIpAddress): address is ipaddr.IPv6;
/** Parses canonical IPv4/IPv6 literals, rejecting legacy IPv4 shorthand forms. */
export declare function parseCanonicalIpAddress(raw: string | undefined): ParsedIpAddress | undefined;
/** Parses canonical IP literals plus legacy IPv4 forms needed for SSRF checks. */
export declare function parseLooseIpAddress(raw: string | undefined): ParsedIpAddress | undefined;
/** Normalizes canonical IP literals and maps IPv4-mapped IPv6 addresses to IPv4 text. */
export declare function normalizeIpAddress(raw: string | undefined): string | undefined;
/** True only for canonical four-part dotted-decimal IPv4 literals. */
export declare function isCanonicalDottedDecimalIPv4(raw: string | undefined): boolean;
/** Detects legacy numeric IPv4 forms that canonical parsing deliberately rejects. */
export declare function isLegacyIpv4Literal(raw: string | undefined): boolean;
/** True when a canonical IP literal is loopback, including IPv4-mapped IPv6. */
export declare function isLoopbackIpAddress(raw: string | undefined): boolean;
/** True for link-local IPs, including legacy and embedded-IPv4 forms. */
export declare function isLinkLocalIpAddress(raw: string | undefined): boolean;
/** True for cloud metadata IP literals, including mapped and embedded forms. */
export declare function isCloudMetadataIpAddress(raw: string | undefined): boolean;
/** True for canonical private, loopback, link-local, or blocked special-use IPs. */
export declare function isPrivateOrLoopbackIpAddress(raw: string | undefined): boolean;
/** Applies the SSRF block policy for parsed IPv6 special-use ranges. */
export declare function isBlockedSpecialUseIpv6Address(address: ipaddr.IPv6, options?: Ipv6SpecialUseBlockOptions): boolean;
/** True for canonical IPv4 literals in RFC 1918 private ranges. */
export declare function isRfc1918Ipv4Address(raw: string | undefined): boolean;
/** True for canonical IPv4 literals in the carrier-grade NAT range. */
export declare function isCarrierGradeNatIpv4Address(raw: string | undefined): boolean;
/** Applies the SSRF block policy for parsed IPv4 special-use ranges. */
export declare function isBlockedSpecialUseIpv4Address(address: ipaddr.IPv4, options?: Ipv4SpecialUseBlockOptions): boolean;
/** Extracts embedded IPv4 addresses from mapped and transition IPv6 prefixes. */
export declare function extractEmbeddedIpv4FromIpv6(address: ipaddr.IPv6): ipaddr.IPv4 | undefined;
/** Checks an IP literal against an exact IP or CIDR range, normalizing mapped IPv4. */
export declare function isIpInCidr(ip: string, cidr: string): boolean;
