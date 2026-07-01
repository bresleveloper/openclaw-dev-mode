import os from "node:os";
/** Raw `os.networkInterfaces()` snapshot used by gateway discovery helpers. */
export type NetworkInterfacesSnapshot = ReturnType<typeof os.networkInterfaces>;
type NetworkInterfaceFamily = "IPv4" | "IPv6";
type ExternalNetworkInterfaceAddress = {
    name: string;
    address: string;
    family: NetworkInterfaceFamily;
};
/** Reads the current network interface snapshot, allowing tests to inject a reader. */
export declare function readNetworkInterfaces(networkInterfaces?: () => NetworkInterfacesSnapshot): NetworkInterfacesSnapshot;
/** Best-effort interface read that returns undefined when OS inspection fails. */
export declare function safeNetworkInterfaces(networkInterfaces?: () => NetworkInterfacesSnapshot): NetworkInterfacesSnapshot | undefined;
/** Lists non-internal interface addresses, optionally filtered by IP family. */
export declare function listExternalInterfaceAddresses(snapshot: NetworkInterfacesSnapshot | undefined, family?: NetworkInterfaceFamily): ExternalNetworkInterfaceAddress[];
/** Picks a matching external address, honoring preferred interface names first. */
export declare function pickMatchingExternalInterfaceAddress(snapshot: NetworkInterfacesSnapshot | undefined, params: {
    family: NetworkInterfaceFamily;
    preferredNames?: string[];
    matches?: (address: string) => boolean;
}): string | undefined;
export {};
