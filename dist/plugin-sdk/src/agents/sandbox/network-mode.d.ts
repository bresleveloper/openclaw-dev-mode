/** Reason a requested network mode is blocked by sandbox policy. */
type NetworkModeBlockReason = "host" | "container_namespace_join";
/** Normalizes optional Docker network mode strings for policy checks. */
export declare function normalizeNetworkMode(network: string | undefined): string | undefined;
/** Returns the concrete block reason for dangerous network modes, if blocked. */
export declare function getBlockedNetworkModeReason(params: {
    network: string | undefined;
    allowContainerNamespaceJoin?: boolean;
}): NetworkModeBlockReason | null;
/** Returns whether a network mode weakens sandbox network isolation. */
export declare function isDangerousNetworkMode(network: string | undefined): boolean;
export {};
