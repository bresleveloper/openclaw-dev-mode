/** Tailnet addresses discovered on external local interfaces. */
type TailnetAddresses = {
    ipv4: string[];
    ipv6: string[];
};
/** Returns true when an address is inside Tailscale's CGNAT IPv4 range. */
export declare function isTailnetIPv4(address: string): boolean;
/** Lists unique Tailscale IPv4/IPv6 addresses from local external interfaces. */
export declare function listTailnetAddresses(): TailnetAddresses;
/** Returns the first discovered Tailscale IPv4 address, if any. */
export declare function pickPrimaryTailnetIPv4(): string | undefined;
/** Returns the first discovered Tailscale IPv6 address, if any. */
export declare function pickPrimaryTailnetIPv6(): string | undefined;
export {};
